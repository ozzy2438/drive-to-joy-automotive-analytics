import { readFile } from "node:fs/promises";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const dataDirectory = process.env.DTJ_LOCAL_DATA_DIR
  ? path.resolve(process.env.DTJ_LOCAL_DATA_DIR)
  : path.resolve(".local-data");
const repositoryRoot = path.resolve("../..");

async function readJson(pathname) {
  return JSON.parse(await readFile(pathname, "utf8"));
}

async function readNdjson(filename) {
  try {
    const content = await readFile(path.join(dataDirectory, filename), "utf8");
    return content
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

const forbiddenKeys = new Set([
  "name",
  "first_name",
  "last_name",
  "full_name",
  "email",
  "email_address",
  "phone",
  "phone_number",
  "address",
  "postal_address",
  "postcode",
  "postal_code",
  "raw_financial_value",
]);
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phonePattern = /^\s*(?:\+?61|0)[\s()-]*(?:\d[\s()-]*){8,10}\s*$/;

function containsForbiddenPii(value, key) {
  if (key && forbiddenKeys.has(key.toLowerCase())) {
    return true;
  }
  if (typeof value === "string") {
    return emailPattern.test(value) || phonePattern.test(value);
  }
  if (Array.isArray(value)) {
    return value.some((item) => containsForbiddenPii(item));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).some(([childKey, childValue]) =>
      containsForbiddenPii(childValue, childKey),
    );
  }
  return false;
}

function hasDuplicates(values) {
  const populated = values.filter(Boolean);
  return new Set(populated).size !== populated.length;
}

const eventSchema = await readJson(
  path.join(repositoryRoot, "contracts/schemas/canonical_event.schema.json"),
);
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateEvent = ajv.compile(eventSchema);
const events = await readNdjson("events.ndjson");
const crmEnvelopes = await readNdjson("crm-records.ndjson");
const canonicalEventsValid = events.every(({ ingested_at_utc, ...event }) => {
  void ingested_at_utc;
  return validateEvent(event);
});
const submitEvents = events.filter((event) =>
  ["test_drive_submit", "quote_submit"].includes(event.event_name),
);
const crmSubmissionIds = new Set(
  crmEnvelopes.map((envelope) => envelope.submission.web_submission_id),
);
const crmMatchValid = submitEvents.every(
  (event) =>
    crmSubmissionIds.has(event.web_submission_id) &&
    crmEnvelopes.some(
      (envelope) =>
        envelope.submission.web_submission_id === event.web_submission_id &&
        envelope.submission.lead_id_hash === event.lead_id_hash,
    ),
);
const experimentExposures = events.filter(
  (event) => event.event_name === "experiment_exposure",
);
const personalisationExposures = events.filter(
  (event) => event.event_name === "personalisation_exposure",
);

const checks = {
  events_present: events.length > 0,
  canonical_schema_validation: canonicalEventsValid,
  crm_match_validation: crmMatchValid,
  forbidden_pii_scan: !containsForbiddenPii({ events, crmEnvelopes }),
  duplicate_conversion_check: !hasDuplicates(
    submitEvents.map((event) => event.web_submission_id),
  ),
  duplicate_experiment_exposure_check: !hasDuplicates(
    experimentExposures.map((event) => event.experiment_assignment_id),
  ),
  duplicate_personalisation_exposure_check: !hasDuplicates(
    personalisationExposures.map(
      (event) => event.personalisation_assignment_id,
    ),
  ),
};
const result = {
  data_origin: "synthetic",
  data_directory: dataDirectory,
  metrics: {
    events: events.length,
    crm_records: crmEnvelopes.length,
    submit_events: submitEvents.length,
    experiment_exposures: experimentExposures.length,
    personalisation_exposures: personalisationExposures.length,
  },
  checks,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (Object.values(checks).some((passed) => !passed)) {
  process.exitCode = 1;
}

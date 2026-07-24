const FORBIDDEN_KEYS = new Set([
  "name",
  "first_name",
  "last_name",
  "full_name",
  "customer_name",
  "email",
  "email_address",
  "customer_email",
  "phone",
  "phone_number",
  "customer_phone",
  "address",
  "postal_address",
  "customer_address",
  "postcode",
  "postal_code",
  "raw_financial_value",
]);

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_PATTERN = /^\s*(?:\+?61|0)[\s()-]*(?:\d[\s()-]*){8,10}\s*$/;
const FORBIDDEN_QUERY_PATTERN =
  /[?&](?:name|email|phone|address|postcode|postal_code)=/i;

export class PiiGuardError extends Error {
  constructor(reason: string) {
    super(`Analytics payload rejected by PII guard: ${reason}`);
    this.name = "PiiGuardError";
  }
}

function inspect(value: unknown, key?: string): void {
  const normalisedKey = key?.trim().toLowerCase();
  if (normalisedKey && FORBIDDEN_KEYS.has(normalisedKey)) {
    throw new PiiGuardError(`forbidden field "${normalisedKey}"`);
  }

  if (typeof value === "string") {
    if (EMAIL_PATTERN.test(value)) {
      throw new PiiGuardError("email-shaped value");
    }
    if (PHONE_PATTERN.test(value)) {
      throw new PiiGuardError("phone-shaped value");
    }
    if (FORBIDDEN_QUERY_PATTERN.test(value)) {
      throw new PiiGuardError("forbidden URL parameter");
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => inspect(item));
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([childKey, childValue]) =>
      inspect(childValue, childKey),
    );
  }
}

export function assertNoRawPii(value: unknown): void {
  inspect(value);
}

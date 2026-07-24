import { createHash } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

const consent = {
  analytics: "granted",
  marketing: "denied",
  cmpVersion: "cmp_demo_1",
  updatedAt: "2026-07-24T00:00:00.000Z",
};

async function initialiseConsent(
  page: Page,
  analytics: "granted" | "denied",
  browserId?: string,
) {
  await page.addInitScript(
    ({ analyticsState, fixedBrowserId }) => {
      localStorage.setItem(
        "dtj_consent_v1",
        JSON.stringify({
          ...analyticsState,
          analytics: analyticsState.analytics,
        }),
      );
      if (fixedBrowserId) {
        localStorage.setItem("dtj_browser_v1", fixedBrowserId);
      }
    },
    {
      analyticsState: { ...consent, analytics },
      fixedBrowserId: browserId,
    },
  );
}

async function collectedEventNames(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    (window.dataLayer ?? []).map((entry) => entry.canonical_event.event_name),
  );
}

function browserIdForHoldout(audienceId: string): string {
  for (let index = 0; index < 10_000; index += 1) {
    const candidate = `usr_holdout_example_${index}`;
    const digest = createHash("sha256")
      .update(`${audienceId}|${candidate}`)
      .digest("hex");
    const bucket = Number.parseInt(digest.slice(0, 8), 16) / 0x1_0000_0000;
    if (bucket < 0.2) {
      return candidate;
    }
  }
  throw new Error("Unable to find deterministic holdout fixture");
}

test("research flow emits governed model, variant, specification and offer events", async ({
  page,
}) => {
  await initialiseConsent(page, "granted");
  await page.goto("/");
  await expect(
    page.getByText(
      "This is a fictional portfolio demonstration. It is not a real vehicle sales website.",
    ),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore vehicle range" }).click();
  await page.getByRole("link", { name: "Research model" }).first().click();
  await page.getByLabel("Fictional variant").selectOption({ index: 1 });
  await page
    .getByRole("button", { name: "Record specification view" })
    .click();
  await page
    .getByRole("button", { name: "Record fictional offer view" })
    .click();

  await expect
    .poll(() => collectedEventNames(page))
    .toEqual(
      expect.arrayContaining([
        "view_homepage",
        "view_vehicle_range",
        "view_vehicle_model",
        "view_vehicle_variant",
        "view_specification",
        "view_offer",
      ]),
    );
});

test("configurator carries one stable ID from start to completion", async ({
  page,
}) => {
  await initialiseConsent(page, "granted");
  await page.goto("/build/aurora-suv");
  await page.getByRole("button", { name: "Save step" }).click();
  await page.getByRole("button", { name: "Save step" }).click();
  await page
    .getByRole("button", { name: "Complete configuration" })
    .click();
  await expect(page.getByText("Configuration complete.")).toBeVisible();

  const configuratorEvents = await page.evaluate(() =>
    (window.dataLayer ?? [])
      .map((entry) => entry.canonical_event)
      .filter((event) => event.event_name.startsWith("configurator_")),
  );
  expect(configuratorEvents.map((event) => event.event_name)).toEqual(
    expect.arrayContaining([
      "configurator_start",
      "configurator_step_complete",
      "configurator_complete",
    ]),
  );
  expect(
    new Set(configuratorEvents.map((event) => event.configurator_id)).size,
  ).toBe(1);
});

test("finance flow produces illustrative bands and eligible personalisation", async ({
  page,
}) => {
  await initialiseConsent(page, "granted");
  await page.goto("/finance/aurora-suv");
  await page
    .getByRole("button", { name: "Generate illustrative band" })
    .click();
  await page
    .getByRole("button", { name: "Generate illustrative band" })
    .click();
  await expect(page.getByText(/finance_support_next_step|generic_holdout/)).toBeVisible();

  await expect
    .poll(() => collectedEventNames(page))
    .toEqual(
      expect.arrayContaining([
        "finance_calculator_start",
        "finance_calculator_complete",
        "personalisation_exposure",
      ]),
    );
});

test("dealer selection is carried into test drive and local CRM", async ({
  page,
}) => {
  await initialiseConsent(page, "granted");
  await page.goto("/dealers");
  await page.getByRole("button", { name: "Search synthetic network" }).click();
  const dealerCard = page
    .locator("article")
    .filter({ hasText: "AstraDrive Geelong" });
  await dealerCard.getByRole("button", { name: "Select dealer" }).click();
  await page.getByRole("link", { name: "Continue to test drive" }).click();
  await page.getByRole("button", { name: "Submit synthetic request" }).click();
  await expect(
    page.getByText("Confirm that this is a synthetic demonstration."),
  ).toBeVisible();
  await page
    .getByText(/I understand this is a fictional portfolio demonstration/)
    .click();
  await page.getByRole("button", { name: "Submit synthetic request" }).click();
  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(page.getByText("Synthetic CRM handoff complete")).toBeVisible();

  const names = await collectedEventNames(page);
  expect(names).toEqual(
    expect.arrayContaining([
      "dealer_search",
      "dealer_select",
      "test_drive_start",
      "form_error",
      "test_drive_submit",
    ]),
  );
  const submit = await page.evaluate(() =>
    (window.dataLayer ?? [])
      .map((entry) => entry.canonical_event)
      .find((event) => event.event_name === "test_drive_submit"),
  );
  expect(submit?.dealer_id).toBe("VIC-003");
  expect(submit?.form_instance_id).toMatch(/^frm_/);
  expect(submit?.web_submission_id).toMatch(/^sub_/);
  expect(submit?.lead_id_hash).toMatch(/^lead_/);

  const response = await page.request.get("/api/crm/export");
  expect(response.ok()).toBe(true);
  const crmExport = await response.json();
  expect(
    crmExport.records.some(
      (record: { submission: { web_submission_id: string } }) =>
        record.submission.web_submission_id === submit?.web_submission_id,
    ),
  ).toBe(true);
  expect(JSON.stringify(crmExport)).not.toContain("internal_lead_reference");
});

test("quote flow creates a separate accepted submission", async ({ page }) => {
  await initialiseConsent(page, "granted");
  await page.goto("/quote");
  await page
    .getByText(/I understand this is a fictional portfolio demonstration/)
    .click();
  await page.getByRole("button", { name: "Submit synthetic request" }).click();
  await expect(page).toHaveURL(/\/thank-you$/);
  expect(await collectedEventNames(page)).toEqual(
    expect.arrayContaining(["quote_start", "quote_submit"]),
  );
});

test("consent denied blocks identities, assignment and business collection", async ({
  page,
}) => {
  await initialiseConsent(page, "denied");
  await page.goto("/vehicles/aurora-suv");
  await expect(page.getByTestId("experiment-cta")).toHaveAttribute(
    "data-variant",
    "generic",
  );
  await page.waitForTimeout(100);
  expect(await collectedEventNames(page)).toEqual([]);
  const analyticsKeys = await page.evaluate(() =>
    Object.keys(localStorage).filter(
      (key) =>
        key.startsWith("dtj_browser_") ||
        key.startsWith("dtj_exp_") ||
        key.startsWith("dtj_pers_"),
    ),
  );
  expect(analyticsKeys).toEqual([]);
});

test("experiment assignment persists and exposure is emitted once", async ({
  page,
}) => {
  await initialiseConsent(page, "granted", "usr_experiment_example_001");
  await page.goto("/vehicles/aurora-suv");
  const cta = page.getByTestId("experiment-cta");
  await expect(cta).not.toHaveAttribute("data-variant", "generic");
  const assignedVariant = await cta.getAttribute("data-variant");
  await page.reload();
  await expect(page.getByTestId("experiment-cta")).toHaveAttribute(
    "data-variant",
    assignedVariant!,
  );
  await expect
    .poll(async () => {
      const names = await collectedEventNames(page);
      return names.filter((name) => name === "experiment_exposure").length;
    })
    .toBe(0);
});

test("regional audience can render deterministic generic holdout", async ({
  page,
}) => {
  await initialiseConsent(
    page,
    "granted",
    browserIdForHoldout("AUD-REG-005"),
  );
  await page.goto("/dealers");
  await page.getByRole("button", { name: "Search synthetic network" }).click();
  const dealerCard = page
    .locator("article")
    .filter({ hasText: "AstraDrive Geelong" });
  await dealerCard.getByRole("button", { name: "Select dealer" }).click();
  await expect(page.getByText("Generic holdout experience")).toBeVisible();
  await expect
    .poll(() => collectedEventNames(page))
    .toContain("personalisation_exposure");
});

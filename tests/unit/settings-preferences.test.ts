import {
  defaultUserSettings,
  getDashboardViewLabel,
  getRiskPreferenceLabel,
  isMissingUserSettingsStorage,
  mapUserSettingsRowToRecord,
  normalizeUserSettingsInput,
  userSettingsSchema,
} from "@/lib/settings/preferences";

describe("settings preferences", () => {
  it("validates supported settings values", () => {
    const parsed = userSettingsSchema.safeParse({
      portfolioName: " Growth Portfolio ",
      defaultCurrency: "EUR",
      riskPreference: "balanced",
      dashboardView: "compact",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(normalizeUserSettingsInput(parsed.data)).toEqual({
        portfolioName: "Growth Portfolio",
        defaultCurrency: "EUR",
        riskPreference: "balanced",
        dashboardView: "compact",
      });
    }
  });

  it("rejects unsupported currency and empty portfolio names", () => {
    const parsed = userSettingsSchema.safeParse({
      portfolioName: " ",
      defaultCurrency: "JPY",
      riskPreference: "balanced",
      dashboardView: "standard",
    });

    expect(parsed.success).toBe(false);
  });

  it("returns defaults when a user has not saved settings", () => {
    expect(mapUserSettingsRowToRecord(null)).toEqual(defaultUserSettings);
  });

  it("formats preference labels for display", () => {
    expect(getRiskPreferenceLabel("conservative")).toBe("Conservative");
    expect(getDashboardViewLabel("compact")).toBe("Compact dashboard");
  });

  it("detects missing settings storage database errors", () => {
    expect(isMissingUserSettingsStorage({ code: "42P01" })).toBe(true);
    expect(
      isMissingUserSettingsStorage({
        message: 'relation "user_settings" does not exist',
      }),
    ).toBe(true);
    expect(isMissingUserSettingsStorage({ code: "23505" })).toBe(false);
  });
});

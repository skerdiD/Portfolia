import { z } from "zod";
import {
  dashboardViewEnum,
  displayCurrencyEnum,
  riskPreferenceEnum,
  type DashboardView,
  type DisplayCurrency,
  type RiskPreference,
  type UserSettings,
} from "@/lib/db/schema";

export const DEFAULT_PORTFOLIO_NAME = "My Portfolio";

export type UserSettingsRecord = {
  portfolioName: string;
  defaultCurrency: DisplayCurrency;
  riskPreference: RiskPreference;
  dashboardView: DashboardView;
};

export const userSettingsSchema = z.object({
  portfolioName: z
    .string()
    .trim()
    .min(1, "Portfolio name is required")
    .max(80, "Portfolio name must be 80 characters or less"),
  defaultCurrency: z.enum(displayCurrencyEnum.enumValues),
  riskPreference: z.enum(riskPreferenceEnum.enumValues),
  dashboardView: z.enum(dashboardViewEnum.enumValues),
});

export type UserSettingsInput = z.infer<typeof userSettingsSchema>;

export const defaultUserSettings: UserSettingsRecord = {
  portfolioName: DEFAULT_PORTFOLIO_NAME,
  defaultCurrency: "USD",
  riskPreference: "balanced",
  dashboardView: "standard",
};

export function mapUserSettingsRowToRecord(
  row: UserSettings | null | undefined,
): UserSettingsRecord {
  if (!row) {
    return defaultUserSettings;
  }

  return {
    portfolioName: row.portfolioName || DEFAULT_PORTFOLIO_NAME,
    defaultCurrency: row.defaultCurrency,
    riskPreference: row.riskPreference,
    dashboardView: row.dashboardView,
  };
}

export function normalizeUserSettingsInput(
  input: UserSettingsInput,
): UserSettingsInput {
  return {
    portfolioName: input.portfolioName.trim(),
    defaultCurrency: input.defaultCurrency,
    riskPreference: input.riskPreference,
    dashboardView: input.dashboardView,
  };
}

export function getRiskPreferenceLabel(value: RiskPreference) {
  const labels: Record<RiskPreference, string> = {
    conservative: "Conservative",
    balanced: "Balanced",
    aggressive: "Aggressive",
  };

  return labels[value];
}

export function getDashboardViewLabel(value: DashboardView) {
  return value === "compact" ? "Compact dashboard" : "Standard dashboard";
}

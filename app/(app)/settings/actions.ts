"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { upsertCurrentUserSettings } from "@/lib/db/queries";
import { protectMutationRequest } from "@/lib/security/arcjet";
import {
  userSettingsSchema,
  type UserSettingsRecord,
} from "@/lib/settings/preferences";

type SettingsFieldErrors = Partial<
  Record<"portfolioName" | "defaultCurrency" | "riskPreference" | "dashboardView", string[]>
>;

export type SettingsActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: SettingsFieldErrors;
  settings?: UserSettingsRecord;
};

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function toSettingsPayload(formData: FormData) {
  return {
    portfolioName: getStringValue(formData.get("portfolioName")),
    defaultCurrency: getStringValue(formData.get("defaultCurrency")),
    riskPreference: getStringValue(formData.get("riskPreference")),
    dashboardView: getStringValue(formData.get("dashboardView")),
  };
}

function fromZodError(error: ZodError): SettingsActionState {
  return {
    status: "error",
    message: "Please correct the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors as SettingsFieldErrors,
  };
}

function revalidateSettingsPaths() {
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/holdings");
  revalidatePath("/watchlist");
}

export async function updateSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const protection = await protectMutationRequest();

    if (!protection.allowed) {
      return {
        status: "error",
        message: protection.message,
      };
    }

    const parsed = userSettingsSchema.safeParse(toSettingsPayload(formData));

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const settings = await upsertCurrentUserSettings(parsed.data);

    revalidateSettingsPaths();

    return {
      status: "success",
      message: "Settings saved.",
      settings,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return fromZodError(error);
    }

    return {
      status: "error",
      message:
        error instanceof Error && error.message === "Unauthorized"
          ? "You must be signed in to update settings."
          : error instanceof Error && error.message.includes("Settings storage")
            ? error.message
          : "Unable to save settings.",
    };
  }
}

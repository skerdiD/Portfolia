"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import {
  createHoldingForCurrentUser,
  deleteHoldingForCurrentUser,
  getCurrentUserHoldingById,
  updateHoldingForCurrentUser,
  type HoldingRecord,
} from "@/lib/db/queries";
import {
  createHoldingSchema,
  deleteHoldingActionSchema,
  updateHoldingActionSchema,
} from "@/lib/validations/holding";

type HoldingFieldErrors = Partial<
  Record<
    | "assetName"
    | "symbol"
    | "category"
    | "quantity"
    | "averageBuyPrice"
    | "currentPrice"
    | "purchaseDate"
    | "notes"
    | "holdingId",
    string[]
  >
>;

export type HoldingActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: HoldingFieldErrors;
  holding?: HoldingRecord;
};

export type DeleteHoldingActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const successPaths = ["/dashboard", "/holdings", "/analytics"];

function revalidateHoldingPaths() {
  for (const path of successPaths) {
    revalidatePath(path);
  }
}

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function toCreatePayload(formData: FormData) {
  return {
    assetName: getStringValue(formData.get("assetName")),
    symbol: getStringValue(formData.get("symbol")),
    category: getStringValue(formData.get("category")),
    quantity: getStringValue(formData.get("quantity")),
    averageBuyPrice: getStringValue(formData.get("averageBuyPrice")),
    currentPrice: getStringValue(formData.get("currentPrice")),
    purchaseDate: getStringValue(formData.get("purchaseDate")),
    notes: getStringValue(formData.get("notes")) || null,
  };
}

function toUpdatePayload(formData: FormData) {
  return {
    holdingId: getStringValue(formData.get("holdingId")),
    assetName: getStringValue(formData.get("assetName")),
    symbol: getStringValue(formData.get("symbol")),
    category: getStringValue(formData.get("category")),
    quantity: getStringValue(formData.get("quantity")),
    averageBuyPrice: getStringValue(formData.get("averageBuyPrice")),
    currentPrice: getStringValue(formData.get("currentPrice")),
    purchaseDate: getStringValue(formData.get("purchaseDate")),
    notes: formData.has("notes") ? getStringValue(formData.get("notes")) : undefined,
  };
}

function toDeletePayload(formData: FormData) {
  return {
    holdingId: getStringValue(formData.get("holdingId")),
  };
}

function normalizePartialUpdatePayload(
  input: ReturnType<typeof toUpdatePayload>,
) {
  return {
    holdingId: input.holdingId,
    ...(input.assetName !== "" ? { assetName: input.assetName } : {}),
    ...(input.symbol !== "" ? { symbol: input.symbol } : {}),
    ...(input.category !== "" ? { category: input.category } : {}),
    ...(input.quantity !== "" ? { quantity: input.quantity } : {}),
    ...(input.averageBuyPrice !== "" ? { averageBuyPrice: input.averageBuyPrice } : {}),
    ...(input.currentPrice !== "" ? { currentPrice: input.currentPrice } : {}),
    ...(input.purchaseDate !== "" ? { purchaseDate: input.purchaseDate } : {}),
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
  };
}

function fromZodError(error: ZodError, message: string): HoldingActionState {
  return {
    status: "error",
    message,
    fieldErrors: error.flatten().fieldErrors as HoldingFieldErrors,
  };
}

export async function createHoldingAction(
  _prevState: HoldingActionState,
  formData: FormData,
): Promise<HoldingActionState> {
  try {
    const parsed = createHoldingSchema.safeParse(toCreatePayload(formData));

    if (!parsed.success) {
      return fromZodError(parsed.error, "Please correct the highlighted fields.");
    }

    const holding = await createHoldingForCurrentUser(parsed.data);

    revalidateHoldingPaths();

    return {
      status: "success",
      message: "Holding created successfully.",
      holding,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return fromZodError(error, "Please correct the highlighted fields.");
    }

    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Unable to create holding.",
    };
  }
}

export async function updateHoldingAction(
  _prevState: HoldingActionState,
  formData: FormData,
): Promise<HoldingActionState> {
  try {
    const parsed = updateHoldingActionSchema.safeParse(
      normalizePartialUpdatePayload(toUpdatePayload(formData)),
    );

    if (!parsed.success) {
      return fromZodError(parsed.error, "Please correct the highlighted fields.");
    }

    const existingHolding = await getCurrentUserHoldingById(parsed.data.holdingId);

    if (!existingHolding) {
      return {
        status: "error",
        message: "Holding not found.",
      };
    }

    const { holdingId, ...updates } = parsed.data;
    const holding = await updateHoldingForCurrentUser(holdingId, updates);

    if (!holding) {
      return {
        status: "error",
        message: "Holding not found or could not be updated.",
      };
    }

    revalidateHoldingPaths();

    return {
      status: "success",
      message: "Holding updated successfully.",
      holding,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return fromZodError(error, "Please correct the highlighted fields.");
    }

    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Unable to update holding.",
    };
  }
}

export async function deleteHoldingAction(
  _prevState: DeleteHoldingActionState,
  formData: FormData,
): Promise<DeleteHoldingActionState> {
  try {
    const parsed = deleteHoldingActionSchema.safeParse(toDeletePayload(formData));

    if (!parsed.success) {
      return {
        status: "error",
        message: "Invalid holding request.",
      };
    }

    const existingHolding = await getCurrentUserHoldingById(parsed.data.holdingId);

    if (!existingHolding) {
      return {
        status: "error",
        message: "Holding not found.",
      };
    }

    const deleted = await deleteHoldingForCurrentUser(parsed.data.holdingId);

    if (!deleted) {
      return {
        status: "error",
        message: "Holding not found or could not be deleted.",
      };
    }

    revalidateHoldingPaths();

    return {
      status: "success",
      message: "Holding deleted successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Unable to delete holding.",
    };
  }
}
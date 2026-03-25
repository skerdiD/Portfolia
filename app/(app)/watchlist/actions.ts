"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { protectMutationRequest } from "@/lib/security/arcjet";
import {
  createWatchlistItemForCurrentUser,
  deleteWatchlistItemForCurrentUser,
  getCurrentUserWatchlistItemById,
  updateWatchlistItemForCurrentUser,
} from "@/lib/db/queries";
import type { WatchlistItemRecord } from "@/lib/watchlist/types";
import {
  createWatchlistItemSchema,
  deleteWatchlistItemActionSchema,
  updateWatchlistItemActionSchema,
} from "@/lib/validations/watchlist";

type WatchlistFieldErrors = Partial<
  Record<"assetName" | "symbol" | "category" | "targetPrice" | "notes" | "watchlistItemId", string[]>
>;

export type WatchlistActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: WatchlistFieldErrors;
  watchlistItem?: WatchlistItemRecord;
};

export type DeleteWatchlistActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const successPaths = ["/watchlist", "/dashboard", "/analytics"];

function revalidateWatchlistPaths() {
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
    targetPrice: getStringValue(formData.get("targetPrice")),
    notes: getStringValue(formData.get("notes")) || null,
  };
}

function toUpdatePayload(formData: FormData) {
  return {
    watchlistItemId: getStringValue(formData.get("watchlistItemId")),
    assetName: getStringValue(formData.get("assetName")),
    symbol: getStringValue(formData.get("symbol")),
    category: getStringValue(formData.get("category")),
    targetPrice: formData.has("targetPrice") ? getStringValue(formData.get("targetPrice")) : undefined,
    notes: formData.has("notes") ? getStringValue(formData.get("notes")) : undefined,
  };
}

function toDeletePayload(formData: FormData) {
  return {
    watchlistItemId: getStringValue(formData.get("watchlistItemId")),
  };
}

function normalizePartialUpdatePayload(
  input: ReturnType<typeof toUpdatePayload>,
) {
  return {
    watchlistItemId: input.watchlistItemId,
    ...(input.assetName !== "" ? { assetName: input.assetName } : {}),
    ...(input.symbol !== "" ? { symbol: input.symbol } : {}),
    ...(input.category !== "" ? { category: input.category } : {}),
    ...(input.targetPrice !== undefined ? { targetPrice: input.targetPrice } : {}),
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
  };
}

function fromZodError(error: ZodError, message: string): WatchlistActionState {
  return {
    status: "error",
    message,
    fieldErrors: error.flatten().fieldErrors as WatchlistFieldErrors,
  };
}

async function guardMutation() {
  const protection = await protectMutationRequest();

  if (!protection.allowed) {
    return {
      status: "error" as const,
      message: protection.message,
    };
  }

  return null;
}

export async function createWatchlistItemAction(
  _prevState: WatchlistActionState,
  formData: FormData,
): Promise<WatchlistActionState> {
  try {
    const blocked = await guardMutation();

    if (blocked) {
      return blocked;
    }

    const parsed = createWatchlistItemSchema.safeParse(toCreatePayload(formData));

    if (!parsed.success) {
      return fromZodError(parsed.error, "Please correct the highlighted fields.");
    }

    const watchlistItem = await createWatchlistItemForCurrentUser(parsed.data);

    revalidateWatchlistPaths();

    return {
      status: "success",
      message: "Watchlist item added successfully.",
      watchlistItem,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return fromZodError(error, "Please correct the highlighted fields.");
    }

    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Unable to add watchlist item.",
    };
  }
}

export async function updateWatchlistItemAction(
  _prevState: WatchlistActionState,
  formData: FormData,
): Promise<WatchlistActionState> {
  try {
    const blocked = await guardMutation();

    if (blocked) {
      return blocked;
    }

    const parsed = updateWatchlistItemActionSchema.safeParse(
      normalizePartialUpdatePayload(toUpdatePayload(formData)),
    );

    if (!parsed.success) {
      return fromZodError(parsed.error, "Please correct the highlighted fields.");
    }

    const existingItem = await getCurrentUserWatchlistItemById(parsed.data.watchlistItemId);

    if (!existingItem) {
      return {
        status: "error",
        message: "Watchlist item not found.",
      };
    }

    const { watchlistItemId, ...updates } = parsed.data;
    const watchlistItem = await updateWatchlistItemForCurrentUser(watchlistItemId, updates);

    if (!watchlistItem) {
      return {
        status: "error",
        message: "Watchlist item not found or could not be updated.",
      };
    }

    revalidateWatchlistPaths();

    return {
      status: "success",
      message: "Watchlist item updated successfully.",
      watchlistItem,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return fromZodError(error, "Please correct the highlighted fields.");
    }

    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Unable to update watchlist item.",
    };
  }
}

export async function deleteWatchlistItemAction(
  _prevState: DeleteWatchlistActionState,
  formData: FormData,
): Promise<DeleteWatchlistActionState> {
  try {
    const blocked = await guardMutation();

    if (blocked) {
      return blocked;
    }

    const parsed = deleteWatchlistItemActionSchema.safeParse(toDeletePayload(formData));

    if (!parsed.success) {
      return {
        status: "error",
        message: "Invalid watchlist request.",
      };
    }

    const existingItem = await getCurrentUserWatchlistItemById(parsed.data.watchlistItemId);

    if (!existingItem) {
      return {
        status: "error",
        message: "Watchlist item not found.",
      };
    }

    const deleted = await deleteWatchlistItemForCurrentUser(parsed.data.watchlistItemId);

    if (!deleted) {
      return {
        status: "error",
        message: "Watchlist item not found or could not be deleted.",
      };
    }

    revalidateWatchlistPaths();

    return {
      status: "success",
      message: "Watchlist item deleted successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Unable to delete watchlist item.",
    };
  }
}

import { z } from "zod";
import { assetCategoryEnum } from "@/lib/db/schema";
import {
  hasAllowedFractionDigits,
  hasAllowedIntegerDigits,
  isNonNegativeDecimalString,
  MAX_DB_DECIMAL_UPPER_BOUND,
} from "@/lib/validations/decimal";

const trimmedString = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

const nonNegativeFiniteNumber = z.coerce
  .number({
    message: "Enter a valid number",
  })
  .finite("Enter a valid number")
  .min(0, "Value must be zero or greater")
  .refine((value) => value < MAX_DB_DECIMAL_UPPER_BOUND, "Value is too large");

const nullableNonNegativeFiniteNumber = z.preprocess(
  (value) => {
    if (
      (typeof value === "string" && value.trim().length === 0) ||
      value === null ||
      value === undefined
    ) {
      return null;
    }

    return value;
  },
  nonNegativeFiniteNumber.nullable(),
);

export const watchlistCategorySchema = z.enum(assetCategoryEnum.enumValues);

export const watchlistFormSchema = z.object({
  assetName: trimmedString(1, 160),
  symbol: trimmedString(1, 32),
  category: watchlistCategorySchema,
  targetPrice: priceStringSchema("target price"),
  currentPrice: priceStringSchema("current price"),
  notes: z.string().max(4000, "Notes must be 4000 characters or less"),
});

function priceStringSchema(label: string) {
  return z
    .string()
    .trim()
    .refine((value) => {
      if (value.length === 0) {
        return true;
      }

      return isNonNegativeDecimalString(value);
    }, `Enter a valid ${label}`)
    .refine((value) => value.length === 0 || hasAllowedFractionDigits(value, 8), {
      message: "Use no more than 8 decimal places",
    })
    .refine((value) => value.length === 0 || hasAllowedIntegerDigits(value), {
      message: "Value is too large",
    });
}

export const watchlistInputSchema = z.object({
  assetName: trimmedString(1, 160),
  symbol: trimmedString(1, 32),
  category: watchlistCategorySchema,
  targetPrice: nullableNonNegativeFiniteNumber.optional(),
  currentPrice: nullableNonNegativeFiniteNumber.optional(),
  notes: z
    .string()
    .trim()
    .max(4000, "Notes must be 4000 characters or less")
    .optional()
    .nullable()
    .transform((value) => {
      if (!value) {
        return null;
      }

      const normalized = value.trim();
      return normalized.length > 0 ? normalized : null;
    }),
});

export const createWatchlistItemSchema = watchlistInputSchema;

export const updateWatchlistItemSchema = watchlistInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const watchlistItemIdSchema = z.object({
  watchlistItemId: z.string().uuid("Invalid watchlist item id"),
});

export const updateWatchlistItemActionSchema =
  watchlistItemIdSchema.and(updateWatchlistItemSchema);

export const deleteWatchlistItemActionSchema = watchlistItemIdSchema;

export type WatchlistFormValues = z.infer<typeof watchlistFormSchema>;
export type CreateWatchlistItemInput = z.infer<typeof createWatchlistItemSchema>;
export type UpdateWatchlistItemInput = z.infer<typeof updateWatchlistItemSchema>;

import { z } from "zod";
import { assetCategoryEnum } from "@/lib/db/schema";

const trimmedString = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

const nonNegativeFiniteNumber = z.coerce
  .number({
    message: "Enter a valid number",
  })
  .finite("Enter a valid number")
  .min(0, "Value must be zero or greater");

const nullableNonNegativeFiniteNumber = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
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
  targetPrice: z
    .string()
    .trim()
    .refine((value) => {
      if (value.length === 0) {
        return true;
      }

      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= 0;
    }, "Enter a valid target price"),
  notes: z.string().max(4000, "Notes must be 4000 characters or less"),
});

export const watchlistInputSchema = z.object({
  assetName: trimmedString(1, 160),
  symbol: trimmedString(1, 32),
  category: watchlistCategorySchema,
  targetPrice: nullableNonNegativeFiniteNumber.optional(),
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

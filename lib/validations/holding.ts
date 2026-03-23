import { z } from "zod";
import { assetCategoryEnum } from "@/lib/db/schema";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string) {
  if (!isoDatePattern.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const trimmedString = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

const nonNegativeFiniteNumber = z.coerce
  .number({
    invalid_type_error: "Enter a valid number",
  })
  .finite("Enter a valid number")
  .min(0, "Value must be zero or greater");

export const holdingCategorySchema = z.enum(assetCategoryEnum.enumValues);

export const holdingInputSchema = z.object({
  assetName: trimmedString(1, 160),
  symbol: trimmedString(1, 32),
  category: holdingCategorySchema,
  quantity: nonNegativeFiniteNumber,
  averageBuyPrice: nonNegativeFiniteNumber,
  currentPrice: nonNegativeFiniteNumber,
  purchaseDate: z
    .string()
    .trim()
    .refine(isValidIsoDate, "Purchase date must be in YYYY-MM-DD format"),
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

export const createHoldingSchema = holdingInputSchema;

export const updateHoldingSchema = holdingInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const holdingIdSchema = z.object({
  holdingId: z.string().uuid("Invalid holding id"),
});

export const updateHoldingActionSchema = holdingIdSchema.and(updateHoldingSchema);

export const deleteHoldingActionSchema = holdingIdSchema;

export const portfolioSnapshotInputSchema = z.object({
  date: z
    .string()
    .trim()
    .refine(isValidIsoDate, "Snapshot date must be in YYYY-MM-DD format"),
  totalValue: nonNegativeFiniteNumber,
  investedAmount: nonNegativeFiniteNumber,
});

export type HoldingInput = z.infer<typeof holdingInputSchema>;
export type CreateHoldingInput = z.infer<typeof createHoldingSchema>;
export type UpdateHoldingInput = z.infer<typeof updateHoldingSchema>;
export type UpdateHoldingActionInput = z.infer<typeof updateHoldingActionSchema>;
export type DeleteHoldingActionInput = z.infer<typeof deleteHoldingActionSchema>;
export type PortfolioSnapshotInput = z.infer<typeof portfolioSnapshotInputSchema>;
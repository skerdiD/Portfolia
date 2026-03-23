import { z } from "zod";
import { assetCategoryEnum } from "@/lib/db/schema";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string) {
  if (!datePattern.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const nonNegativeNumber = z.coerce
  .number()
  .finite()
  .min(0, "Value must be zero or greater");

const normalizedString = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max);

export const holdingInputSchema = z.object({
  assetName: normalizedString(1, 160),
  symbol: normalizedString(1, 32),
  category: z.enum(assetCategoryEnum.enumValues),
  quantity: nonNegativeNumber,
  averageBuyPrice: nonNegativeNumber,
  currentPrice: nonNegativeNumber,
  purchaseDate: z
    .string()
    .trim()
    .refine(isValidIsoDate, "Purchase date must be in YYYY-MM-DD format"),
  notes: z
    .string()
    .trim()
    .max(4000)
    .optional()
    .nullable()
    .transform((value) => {
      if (!value) {
        return null;
      }

      return value;
    }),
});

export const holdingUpdateSchema = holdingInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const portfolioSnapshotInputSchema = z.object({
  date: z
    .string()
    .trim()
    .refine(isValidIsoDate, "Snapshot date must be in YYYY-MM-DD format"),
  totalValue: nonNegativeNumber,
  investedAmount: nonNegativeNumber,
});

export type HoldingInput = z.infer<typeof holdingInputSchema>;
export type HoldingUpdateInput = z.infer<typeof holdingUpdateSchema>;
export type PortfolioSnapshotInput = z.infer<typeof portfolioSnapshotInputSchema>;
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssetCategory } from "@/lib/db/schema";
import type { HoldingRecord } from "@/lib/portfolio/calculations";
import { createHoldingAction, updateHoldingAction } from "@/app/(app)/holdings/actions";
import { holdingFormSchema, type HoldingFormValues } from "@/lib/validations/holding";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type HoldingFormDialogProps = {
  mode: "create" | "edit";
  holding?: HoldingRecord;
  trigger: React.ReactNode;
  onSuccess?: (holding: HoldingRecord) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const categoryOptions: Array<{ label: string; value: AssetCategory }> = [
  { label: "Stock", value: "stock" },
  { label: "Crypto", value: "crypto" },
  { label: "ETF", value: "etf" },
  { label: "Cash", value: "cash" },
  { label: "Other", value: "other" },
];

function defaultValuesFromHolding(holding?: HoldingRecord): HoldingFormValues {
  if (!holding) {
    return {
      assetName: "",
      symbol: "",
      category: "stock",
      quantity: "",
      averageBuyPrice: "",
      currentPrice: "",
      purchaseDate: "",
      notes: "",
    };
  }

  return {
    assetName: holding.assetName,
    symbol: holding.symbol,
    category: holding.category,
    quantity: String(holding.quantity),
    averageBuyPrice: String(holding.averageBuyPrice),
    currentPrice: String(holding.currentPrice),
    purchaseDate: holding.purchaseDate,
    notes: holding.notes ?? "",
  };
}

export function HoldingFormDialog({
  mode,
  holding,
  trigger,
  onSuccess,
  open: controlledOpen,
  onOpenChange,
}: HoldingFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const open = controlledOpen ?? internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const defaults = useMemo(() => defaultValuesFromHolding(holding), [holding]);

  const form = useForm<HoldingFormValues>({
    resolver: zodResolver(holdingFormSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    form.reset(defaults);
  }, [defaults, form, open]);

  const submitLabel = mode === "create" ? "Add holding" : "Save changes";
  const title = mode === "create" ? "Add new holding" : "Edit holding";
  const description =
    mode === "create"
      ? "Create a new portfolio position with clean, structured financial data."
      : "Update position details, pricing, or notes without leaving the table.";

  async function onSubmit(values: HoldingFormValues) {
    setServerMessage(null);

    startTransition(async () => {
      const formData = new FormData();

      if (mode === "edit" && holding) {
        formData.set("holdingId", holding.id);
      }

      formData.set("assetName", values.assetName);
      formData.set("symbol", values.symbol);
      formData.set("category", values.category);
      formData.set("quantity", values.quantity);
      formData.set("averageBuyPrice", values.averageBuyPrice);
      formData.set("currentPrice", values.currentPrice);
      formData.set("purchaseDate", values.purchaseDate);
      formData.set("notes", values.notes ?? "");

      const result =
        mode === "create"
          ? await createHoldingAction({ status: "idle" }, formData)
          : await updateHoldingAction({ status: "idle" }, formData);

      if (result.status === "success" && result.holding) {
        setServerMessage(null);
        onSuccess?.(result.holding);
        form.reset(defaultValuesFromHolding(result.holding));
        setOpen(false);
        return;
      }

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (!messages || messages.length === 0) {
            return;
          }

          form.setError(field as keyof HoldingFormValues, {
            type: "server",
            message: messages[0],
          });
        });
      }

      setServerMessage(result.message ?? "Something went wrong.");
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setServerMessage(null);
          form.reset(defaultValuesFromHolding(holding));
        }
      }}
      trigger={trigger}
    >
      <Card className="surface w-full rounded-[2rem] border-white/80 p-0 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.24)]">
        <div className="border-b border-slate-200/70 px-6 py-5 sm:px-7">
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Holdings form
          </div>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 px-6 py-6 sm:px-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Asset name"
              error={form.formState.errors.assetName?.message}
            >
              <Input
                placeholder="Apple Inc."
                {...form.register("assetName")}
              />
            </FormField>

            <FormField
              label="Symbol"
              error={form.formState.errors.symbol?.message}
            >
              <Input placeholder="AAPL" {...form.register("symbol")} />
            </FormField>

            <FormField
              label="Category"
              error={form.formState.errors.category?.message}
            >
              <select
                {...form.register("category")}
                className="flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Purchase date"
              error={form.formState.errors.purchaseDate?.message}
            >
              <Input type="date" {...form.register("purchaseDate")} />
            </FormField>

            <FormField
              label="Quantity"
              error={form.formState.errors.quantity?.message}
            >
              <Input
                inputMode="decimal"
                placeholder="10"
                {...form.register("quantity")}
              />
            </FormField>

            <FormField
              label="Average buy price"
              error={form.formState.errors.averageBuyPrice?.message}
            >
              <Input
                inputMode="decimal"
                placeholder="150"
                {...form.register("averageBuyPrice")}
              />
            </FormField>

            <FormField
              label="Current price"
              error={form.formState.errors.currentPrice?.message}
            >
              <Input
                inputMode="decimal"
                placeholder="175"
                {...form.register("currentPrice")}
              />
            </FormField>
          </div>

          <FormField
            label="Notes"
            error={form.formState.errors.notes?.message}
          >
            <Textarea
              rows={5}
              placeholder="Optional thesis, context, or trade notes..."
              {...form.register("notes")}
            />
          </FormField>

          {serverMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {serverMessage}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </Card>
    </Dialog>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      <span
        className={cn(
          "block min-h-[1.25rem] text-sm",
          error ? "text-rose-600" : "text-transparent",
        )}
      >
        {error ?? "."}
      </span>
    </label>
  );
}

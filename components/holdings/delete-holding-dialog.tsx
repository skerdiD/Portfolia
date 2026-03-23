"use client";

import { useState, useTransition } from "react";
import type { HoldingRecord } from "@/lib/portfolio/calculations";
import { deleteHoldingAction } from "@/app/(app)/holdings/actions";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";

type DeleteHoldingDialogProps = {
  holding: HoldingRecord;
  trigger: React.ReactNode;
  onDeleted?: (holdingId: string) => void;
};

export function DeleteHoldingDialog({
  holding,
  trigger,
  onDeleted,
}: DeleteHoldingDialogProps) {
  const [open, setOpen] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("holdingId", holding.id);

      const result = await deleteHoldingAction({ status: "idle" }, formData);

      if (result.status === "success") {
        setServerMessage(null);
        onDeleted?.(holding.id);
        setOpen(false);
        return;
      }

      setServerMessage(result.message ?? "Unable to delete holding.");
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setServerMessage(null);
        }
      }}
      trigger={trigger}
    >
      <Card className="surface w-full rounded-[2rem] border-white/80 p-0 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.24)]">
        <div className="border-b border-slate-200/70 px-6 py-5 sm:px-7">
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-600">
            Delete holding
          </div>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950">
            Remove {holding.symbol} from your portfolio?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            This action deletes the holding record and revalidates your dashboard,
            analytics, and holdings views.
          </p>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-7">
          <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-5">
            <div className="font-semibold text-slate-950">{holding.assetName}</div>
            <div className="mt-1 text-sm text-muted-foreground">{holding.symbol}</div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <div className="text-sm text-slate-500">Invested</div>
                <div className="mt-1 font-semibold text-slate-950">
                  {formatCurrency(holding.investedAmount)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Current Value</div>
                <div className="mt-1 font-semibold text-slate-950">
                  {formatCurrency(holding.currentValue)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Return</div>
                <div
                  className={`mt-1 font-semibold ${
                    holding.gainLoss >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {formatPercentage(holding.returnPercentage)}
                </div>
              </div>
            </div>
          </div>

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
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={isPending}
              className="bg-rose-600 hover:bg-rose-700"
              onClick={handleDelete}
            >
              {isPending ? "Deleting..." : "Delete holding"}
            </Button>
          </div>
        </div>
      </Card>
    </Dialog>
  );
}
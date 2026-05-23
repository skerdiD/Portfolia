"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CheckCircle2, Save, SlidersHorizontal } from "lucide-react";
import {
  updateSettingsAction,
  type SettingsActionState,
} from "@/app/(app)/settings/actions";
import type { UserSettingsRecord } from "@/lib/settings/preferences";
import {
  getDashboardViewLabel,
  getRiskPreferenceLabel,
} from "@/lib/settings/preferences";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type SettingsPreferencesFormProps = {
  settings: UserSettingsRecord;
};

const currencyOptions = [
  { label: "USD", value: "USD", helper: "US dollars" },
  { label: "EUR", value: "EUR", helper: "Euros" },
  { label: "GBP", value: "GBP", helper: "British pounds" },
] as const;

const riskOptions = [
  { label: "Conservative", value: "conservative" },
  { label: "Balanced", value: "balanced" },
  { label: "Aggressive", value: "aggressive" },
] as const;

const dashboardViewOptions = [
  { label: "Standard dashboard", value: "standard" },
  { label: "Compact dashboard", value: "compact" },
] as const;

function initialState(settings: UserSettingsRecord): SettingsActionState {
  return {
    status: "idle",
    settings,
  };
}

export function SettingsPreferencesForm({
  settings,
}: SettingsPreferencesFormProps) {
  const [state, setState] = useState<SettingsActionState>(() => initialState(settings));
  const [isPending, startTransition] = useTransition();

  const currentSettings = state.settings ?? settings;

  useEffect(() => {
    setState(initialState(settings));
  }, [settings]);

  const activeSummary = useMemo(
    () => [
      `${currentSettings.defaultCurrency} display`,
      getRiskPreferenceLabel(currentSettings.riskPreference),
      getDashboardViewLabel(currentSettings.dashboardView),
    ],
    [currentSettings],
  );

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateSettingsAction(state, formData);
      setState(result);
    });
  }

  return (
    <Card className="surface motion-card rounded-[1.75rem]">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
          <SlidersHorizontal className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold text-slate-950">
            Portfolio preferences
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Defaults that shape your dashboard context and display labels.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form
          key={`${currentSettings.portfolioName}-${currentSettings.defaultCurrency}-${currentSettings.riskPreference}-${currentSettings.dashboardView}`}
          onSubmit={onSubmit}
          className="grid gap-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="portfolioName" className="text-sm font-medium text-slate-700">
                Portfolio name
              </label>
              <Input
                id="portfolioName"
                name="portfolioName"
                defaultValue={currentSettings.portfolioName}
                placeholder="My Portfolio"
              />
              <p className="text-sm leading-6 text-slate-500">
                Used as the dashboard heading. If no saved setting exists, Portfolia falls back to My Portfolio.
              </p>
              <FieldMessage messages={state.fieldErrors?.portfolioName} />
            </div>

            <SelectField
              id="defaultCurrency"
              name="defaultCurrency"
              label="Default currency"
              defaultValue={currentSettings.defaultCurrency}
              error={state.fieldErrors?.defaultCurrency?.[0]}
              helper="Controls display conversion only. Stored portfolio values stay unchanged."
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.helper}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="riskPreference"
              name="riskPreference"
              label="Risk preference"
              defaultValue={currentSettings.riskPreference}
              error={state.fieldErrors?.riskPreference?.[0]}
              helper="Saved as neutral profile context for your workspace."
            >
              {riskOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="dashboardView"
              name="dashboardView"
              label="Dashboard view"
              defaultValue={currentSettings.dashboardView}
              error={state.fieldErrors?.dashboardView?.[0]}
              helper="Compact view keeps the dashboard tighter by hiding recent activity."
            >
              {dashboardViewOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Active profile
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {activeSummary.map((item) => (
                <Badge key={item} variant="outline" className="bg-white">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {state.message ? (
            <div
              className={
                state.status === "success"
                  ? "flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                  : "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              }
            >
              {state.status === "success" ? <CheckCircle2 className="h-4 w-4" /> : null}
              {state.message}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save preferences"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SelectField({
  id,
  name,
  label,
  defaultValue,
  error,
  helper,
  children,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
      >
        {children}
      </select>
      {helper ? <p className="text-sm leading-6 text-slate-500">{helper}</p> : null}
      <FieldMessage messages={error ? [error] : undefined} />
    </div>
  );
}

function FieldMessage({ messages }: { messages?: string[] }) {
  return (
    <div className="min-h-[1.25rem] text-sm text-rose-600">
      {messages?.[0] ?? ""}
    </div>
  );
}

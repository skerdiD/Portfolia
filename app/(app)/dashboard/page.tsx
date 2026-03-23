import { currentUser } from "@clerk/nextjs/server";
import {
  BadgeDollarSign,
  ChartNoAxesCombined,
  ShieldCheck,
  Wallet2,
} from "lucide-react";
import { NewUserEmptyState } from "@/components/dashboard/new-user-empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Authenticated workspace"
        title={`Welcome, ${firstName}`}
        description="Your private portfolio workspace is ready. Add your first holding to unlock analytics, allocation insights, and performance tracking."
        actions={
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs font-medium"
          >
            Secure by Clerk
          </Badge>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Holdings"
          value="0"
          icon={Wallet2}
          tone="primary"
          detail="No assets added yet"
        />
        <StatCard
          title="Total Invested"
          value="$0.00"
          icon={BadgeDollarSign}
          tone="primary"
          detail="Your deployed capital will appear here"
        />
        <StatCard
          title="Current Value"
          value="$0.00"
          icon={ChartNoAxesCombined}
          tone="primary"
          detail="Portfolio value starts updating after your first entry"
        />
        <StatCard
          title="Protection"
          value="Active"
          icon={ShieldCheck}
          tone="success"
          detail="Authenticated dashboard and private user access"
        />
      </div>

      <NewUserEmptyState />
    </div>
  );
}
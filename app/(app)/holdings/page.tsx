import { getCurrentUserHoldingsTableData } from "@/lib/db/queries";
import { HoldingsPageClient } from "@/components/holdings/holdings-page-client";

export default async function HoldingsPage() {
  const data = await getCurrentUserHoldingsTableData();

  return <HoldingsPageClient initialData={data} />;
}
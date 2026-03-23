import { protectPageRequest } from "@/lib/security/arcjet";
import { getCurrentUserHoldingsTableData } from "@/lib/db/queries";
import { HoldingsPageClient } from "@/components/holdings/holdings-page-client";

export default async function HoldingsPage() {
  const protection = await protectPageRequest();

  if (!protection.allowed) {
    throw new Error(protection.message);
  }

  const data = await getCurrentUserHoldingsTableData();

  return <HoldingsPageClient initialData={data} />;
}
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-12 w-80 rounded-2xl" />
        <Skeleton className="h-6 w-[36rem] max-w-full rounded-2xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="surface rounded-[1.75rem]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-10 w-36 rounded-2xl" />
                </div>
                <Skeleton className="h-14 w-14 rounded-2xl" />
              </div>
              <Skeleton className="mt-4 h-4 w-40 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="surface rounded-[1.75rem]">
          <CardHeader className="space-y-3">
            <Skeleton className="h-8 w-56 rounded-2xl" />
            <Skeleton className="h-4 w-72 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[360px] w-full rounded-[1.5rem]" />
          </CardContent>
        </Card>

        <Card className="surface rounded-[1.75rem]">
          <CardHeader className="space-y-3">
            <Skeleton className="h-8 w-48 rounded-2xl" />
            <Skeleton className="h-4 w-64 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[360px] w-full rounded-[1.5rem]" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="surface rounded-[1.75rem]">
          <CardHeader className="space-y-3">
            <Skeleton className="h-7 w-40 rounded-2xl" />
            <Skeleton className="h-4 w-56 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-[1.25rem]" />
            ))}
          </CardContent>
        </Card>

        <Card className="surface rounded-[1.75rem]">
          <CardHeader className="space-y-3">
            <Skeleton className="h-7 w-40 rounded-2xl" />
            <Skeleton className="h-4 w-56 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-[1.25rem]" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
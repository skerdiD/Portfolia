import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function WatchlistLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="h-12 w-72 rounded-2xl" />
        <Skeleton className="h-6 w-[34rem] max-w-full rounded-2xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="surface rounded-[1.75rem]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-10 w-32 rounded-2xl" />
                </div>
                <Skeleton className="h-14 w-14 rounded-2xl" />
              </div>
              <Skeleton className="mt-4 h-4 w-44 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="surface rounded-[1.75rem]">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </CardContent>
      </Card>

      <Card className="surface rounded-[1.75rem]">
        <CardHeader className="space-y-3">
          <Skeleton className="h-7 w-44 rounded-2xl" />
          <Skeleton className="h-4 w-60 rounded-full" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-[1.35rem]" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

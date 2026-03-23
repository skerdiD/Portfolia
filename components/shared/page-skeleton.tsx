import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-12 w-72 rounded-2xl" />
        <Skeleton className="h-6 w-[32rem] max-w-full rounded-2xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="surface rounded-[1.75rem]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-10 w-40 rounded-2xl" />
                </div>
                <Skeleton className="h-14 w-14 rounded-2xl" />
              </div>
              <Skeleton className="mt-4 h-4 w-48 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="surface rounded-[1.75rem]">
            <CardHeader className="space-y-3">
              <Skeleton className="h-8 w-56 rounded-2xl" />
              <Skeleton className="h-4 w-72 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[360px] w-full rounded-[1.5rem]" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
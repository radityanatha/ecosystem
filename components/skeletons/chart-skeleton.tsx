import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartSkeleton() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base">
          <Skeleton className="h-5 w-48" />
        </CardTitle>
        <CardDescription className="text-xs">
          <Skeleton className="h-3 w-32 mt-1" />
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[250px] w-full">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 pt-2 pb-4 text-xs">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-64 mt-1" />
      </CardFooter>
    </Card>
  );
}


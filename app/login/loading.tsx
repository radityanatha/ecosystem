import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ShineBorder } from "@/components/ui/shine-border";

export default function LoginLoading() {
  return (
    <div className="flex flex-col items-center w-full max-w-[450px]">
      <div className="flex flex-col items-center text-center mb-10 w-full space-y-2">
        <Skeleton className="h-8 w-64 mx-auto" />
      </div>

      <Card className="relative overflow-hidden border-0 bg-gray-950 p-0 shadow-none w-full">
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        
        <CardContent className="p-6 md:p-8">
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 text-center mb-4">
              <Skeleton className="h-4 w-40 bg-gray-700" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-gray-700" />
              <Skeleton className="h-10 w-full bg-gray-700" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 bg-gray-700" />
                <Skeleton className="h-4 w-32 bg-gray-700" />
              </div>
              <Skeleton className="h-10 w-full bg-gray-700" />
            </div>

            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  showContent?: boolean;
}

export function CardSkeleton({ 
  className, 
  height = "h-[125px]", 
  width = "w-[250px]",
  showContent = true 
}: CardSkeletonProps) {
  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <Skeleton className={cn(height, width, "rounded-xl")} />
      {showContent && (
        <div className="space-y-2">
          <Skeleton className={cn("h-4", width)} />
          <Skeleton className={cn("h-4", width.replace("250", "200"))} />
        </div>
      )}
    </div>
  );
}


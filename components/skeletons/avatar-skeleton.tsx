import { Skeleton } from "@/components/ui/skeleton";

export function AvatarSkeleton({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex items-center space-x-4">
      <Skeleton className={`${sizeClasses[size]} rounded-full`} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}


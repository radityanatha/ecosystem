import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function GateLoading() {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-black/[0.96] antialiased">
      {/* Grid Pattern Background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      {/* Content */}
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center gap-8 px-4">
        <div className="text-center space-y-3">
          <Skeleton className="h-9 w-64 mx-auto bg-white/10" />
          <Skeleton className="h-5 w-80 mx-auto bg-white/10" />
        </div>

        <div className="flex items-center justify-center w-full">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <Skeleton className="h-16 w-16 rounded-2xl bg-white/10" />
                <Skeleton className="h-4 w-20 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


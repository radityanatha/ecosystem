import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProfileSkeleton() {
  return (
    <div className="h-full w-full">
      <div className={cn(
        "group/bento shadow-input flex flex-col border border-neutral-200 bg-white p-6 md:p-8 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        "h-full w-full"
      )}>
        <div className="flex flex-col md:flex-row h-full gap-6 md:gap-8">
          {/* Foto Profile - Kiri */}
          <div className="flex-shrink-0 flex items-center justify-center md:items-start md:justify-start">
            <div className="flex items-center justify-center p-6">
              <Skeleton className="h-24 w-24 md:h-28 md:w-28 rounded-full" />
            </div>
          </div>
          
          {/* Content - Kanan */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex flex-col h-full">
              {/* Nama dan Role */}
              <div className="mb-6 text-center md:text-left space-y-2">
                <Skeleton className="h-7 w-48 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
              </div>

              {/* Informasi Detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3.5 w-3.5 mt-0.5 rounded" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                  </div>
                </div>

                {/* No. HP */}
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3.5 w-3.5 mt-0.5 rounded" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full max-w-[150px]" />
                  </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3.5 w-3.5 mt-0.5 rounded" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-full max-w-[180px]" />
                  </div>
                </div>

                {/* Tempat Lahir */}
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3.5 w-3.5 mt-0.5 rounded" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full max-w-[160px]" />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3.5 w-3.5 mt-0.5 rounded" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-4 w-full max-w-[100px]" />
                  </div>
                </div>

                {/* Masa Kerja */}
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3.5 w-3.5 mt-0.5 rounded" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-full max-w-[140px]" />
                  </div>
                </div>

                {/* Alamat - Full Width */}
                <div className="flex items-start gap-2 md:col-span-2">
                  <Skeleton className="h-3.5 w-3.5 mt-0.5 rounded" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full max-w-[300px]" />
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="mt-4 md:mt-6">
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


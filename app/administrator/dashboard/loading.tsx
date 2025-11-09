import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton";

export default function DashboardLoading() {
  return (
    <SidebarInset className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 pt-0">
        <div className="grid gap-4">
          <ChartSkeleton />
        </div>
      </div>
    </SidebarInset>
  );
}


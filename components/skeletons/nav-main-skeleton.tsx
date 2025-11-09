import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMainSkeleton({ itemCount = 3 }: { itemCount?: number }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Skeleton className="h-4 w-20" />
      </SidebarGroupLabel>
      <SidebarMenu>
        {Array.from({ length: itemCount }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton disabled>
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}


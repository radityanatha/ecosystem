import { administratorMenus } from "./administratorSuperadmin";
import { LucideIcon } from "lucide-react";


export type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export const menuConfigs: Record<number, any> = {
  1: administratorMenus,
};

export function getMenuItems(aplikasiId: number, roleName?: string): MenuItem[] {
  const menuConfig = menuConfigs[aplikasiId];
  
  if (!menuConfig) {
    return []; // Return empty array jika aplikasi tidak ada
  }

  if (roleName === "SuperAdmin") {
    return (menuConfig.SuperAdmin || []) as MenuItem[];
  }

  if (roleName) {
    return (menuConfig[roleName] || []) as MenuItem[];
  }

  // Jika tidak ada roleName → return empty
  return [];
}
import { Home, Users, Settings, Shield, FileText, BarChart3 } from "lucide-react";

export const administratorMenus = {
  SuperAdmin: [
    {
      title: "Dashboard",
      url: "/administrator/dashboard",
      icon: BarChart3,
    },
    {
      title: "Kelola Aplikasi",
      url: "/administrator/aplikasi",
      icon: Settings,
    },
    {
      title: "Kelola Roles",
      url: "/administrator/roles",
      icon: Shield,
    },
  ],
  // Menu tambahan untuk Administrator
  Administrator: [
    {
      title: "Dashboard",
      url: "/administrator/dashboard",
      icon: BarChart3,
    },
  ],
};
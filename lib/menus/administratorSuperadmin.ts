import { Home, Users, Settings, Shield, FileText, BarChart3 } from "lucide-react";

export const administratorMenus = {
  SuperAdmin: [
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
  // Menu tambahan untuk Administrator (kosong karena tidak ada menu khusus)
  Administrator: [],
};
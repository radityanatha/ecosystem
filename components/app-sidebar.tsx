"use client";

import * as React from "react";
import {
  Settings,
  Shield,
  Frame,
  PieChart,
  Map,
  GalleryVerticalEnd,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { getMenuItems, type MenuItem } from "@/lib/menus/index";

export function AppSidebar({
  aplikasiId,
  namaAplikasi,
  roleName,
  userEmail,
  userName,
  userAvatar,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  aplikasiId: number;
  namaAplikasi: string;
  roleName?: string;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [aplikasiList, setAplikasiList] = useState<any[]>([]);

  // Ambil daftar aplikasi pegawai
  useEffect(() => {
    fetch("/api/pegawai/aplikasi")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAplikasiList(data);
        }
      })
      .catch(() => {});
  }, []);

  // Ambil menu items berdasarkan aplikasiId dan roleName
  const menuItems = getMenuItems(aplikasiId, roleName);

  // Transform menu items untuk NavMain
  const navMainItems = menuItems.map((item: MenuItem) => {
    // Active jika pathname sama dengan url atau dimulai dengan url + "/" (untuk nested routes)
    const isActive = pathname === item.url || 
      (pathname.startsWith(item.url + "/") && item.url !== "/");
    
    return {
      title: item.title,
      url: item.url,
      icon: item.icon,
      isActive,
      items: [], // Bisa ditambahkan submenu nanti
    };
  });

  // Data teams untuk TeamSwitcher
  const teams = [
    {
      name: namaAplikasi,
      logo: GalleryVerticalEnd,
      plan: roleName || "User",
    },
  ];

  // Data user
  const userData = {
    name: userName || "User",
    email: userEmail || "user@example.com",
    avatar: userAvatar || "/avatars/default.jpg",
  };

  // Cek apakah sedang di halaman dashboard
  const isDashboardPage = pathname === "/administrator/dashboard";

  return (
    <Sidebar collapsible={isDashboardPage ? undefined : "icon"} {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} aplikasiList={aplikasiList} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";
import {
  IconApps,
  IconShield,
  IconCurrencyDollar,
  IconShoppingCart,
  IconPackage,
  IconUsers,
  IconBriefcase,
  IconBuilding,
  IconLogout,
} from "@tabler/icons-react";

interface Aplikasi {
  id: number;
  namaAplikasi: string;
  href: string;
}

interface GatePageClientProps {
  aplikasi: Aplikasi[];
  namaPegawai: string;
}

// Function untuk mendapatkan icon berdasarkan nama aplikasi
function getIconForAplikasi(namaAplikasi: string) {
  const lowerName = namaAplikasi.toLowerCase();
  
  if (lowerName.includes("administrator") || lowerName.includes("admin")) {
    return <IconShield className="h-full w-full text-neutral-500 dark:text-neutral-300" />;
  }
  if (lowerName.includes("keuangan") || lowerName.includes("finance")) {
    return <IconCurrencyDollar className="h-full w-full text-neutral-500 dark:text-neutral-300" />;
  }
  if (lowerName.includes("purchasing") || lowerName.includes("beli")) {
    return <IconShoppingCart className="h-full w-full text-neutral-500 dark:text-neutral-300" />;
  }
  if (lowerName.includes("logistik") || lowerName.includes("logistic")) {
    return <IconPackage className="h-full w-full text-neutral-500 dark:text-neutral-300" />;
  }
  if (lowerName.includes("hrd") || lowerName.includes("sdm") || lowerName.includes("hr")) {
    return <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />;
  }
  if (lowerName.includes("bisnis") || lowerName.includes("business")) {
    return <IconBriefcase className="h-full w-full text-neutral-500 dark:text-neutral-300" />;
  }
  if (lowerName.includes("perusahaan") || lowerName.includes("company")) {
    return <IconBuilding className="h-full w-full text-neutral-500 dark:text-neutral-300" />;
  }
  if (lowerName.includes("logout") || lowerName.includes("keluar")) {
    return <IconLogout className="h-full w-full text-neutral-500 dark:text-neutral-300" />;
  }
  // Default icon
  return <IconApps className="h-full w-full text-neutral-500 dark:text-neutral-300" />;
}

export function GatePageClient({ aplikasi, namaPegawai }: GatePageClientProps) {
  const dockItems = aplikasi.map((app) => ({
    title: app.namaAplikasi,
    icon: getIconForAplikasi(app.namaAplikasi),
    href: app.href,
  }));

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-black/[0.96] antialiased">
      {/* Grid Pattern Background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />

      {/* Content */}
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center gap-8 px-4">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Selamat Datang, {namaPegawai}
          </h1>
          <p className="text-gray-400">
            Silakan pilih aplikasi yang ingin Anda akses
          </p>
        </div>

        <div className="flex items-center justify-center w-full">
          <FloatingDock
            mobileClassName="translate-y-20"
            items={dockItems}
          />
        </div>
      </div>
    </div>
  );
}


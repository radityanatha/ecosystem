import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const prisma = new PrismaClient();

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const roleName = (user as any).roleName;
  const aplikasiId = 1;

  const aplikasi = await prisma.aplikasi.findUnique({
    where: { id: aplikasiId },
    select: { namaAplikasi: true },
  });

  const namaAplikasi = aplikasi?.namaAplikasi || "Aplikasi";

  // Ambil data pegawai untuk user info
  const pegawai = await prisma.pegawai.findUnique({
    where: { id: parseInt(user.id as string) },
    select: {
      namaPegawai: true,
      email: true,
      foto: true,
    },
  });

  return (
    <SidebarProvider>
      <AppSidebar 
        aplikasiId={aplikasiId} 
        namaAplikasi={namaAplikasi}
        roleName={roleName}
        userName={pegawai?.namaPegawai || "User"}
        userEmail={pegawai?.email || "user@example.com"}
        userAvatar={pegawai?.foto || "/avatars/default.jpg"}
      />
      {children}
    </SidebarProvider>
  );
}


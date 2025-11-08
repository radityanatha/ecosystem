import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { GatePageClient } from "./gate-page-client";

const prisma = new PrismaClient();

export default async function GatePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil aplikasi pegawai
  const pegawai = await prisma.pegawai.findUnique({
    where: { id: parseInt(user.id as string) },
    include: {
      aplikasi: {
        include: {
          aplikasi: true,
        },
      },
      role: true,
    },
  });

  if (!pegawai) {
    redirect("/login");
  }

  // Jika hanya 1 aplikasi → langsung redirect
  if (pegawai.aplikasi.length === 1) {
    redirect(`/app/${pegawai.aplikasi[0].aplikasiId}`);
  }

  // Jika 0 aplikasi → redirect ke login
  if (pegawai.aplikasi.length === 0) {
    redirect("/login");
  }

  // Jika lebih dari 1 aplikasi → tampilkan pilihan dengan FloatingDock
  return (
    <GatePageClient 
      aplikasi={pegawai.aplikasi.map((pa) => ({
        id: pa.aplikasiId,
        namaAplikasi: pa.aplikasi.namaAplikasi,
        href: `/app/${pa.aplikasiId}`,
      }))}
      namaPegawai={pegawai.namaPegawai}
    />
  );
}


import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  // Ambil aplikasi pegawai
  const pegawai = await prisma.pegawai.findUnique({
    where: { id: parseInt(user.id) },
    include: {
      aplikasi: {
        include: {
          aplikasi: true,
        },
      },
    },
  });

  if (!pegawai) {
    redirect("/login");
  }

  // Jika punya 1 aplikasi → langsung redirect ke aplikasi
  if (pegawai.aplikasi.length === 1) {
    redirect(`/app/${pegawai.aplikasi[0].aplikasiId}`);
  }

  // Jika lebih dari 1 atau 0 → redirect ke gate untuk pilih
  redirect("/gate");
}
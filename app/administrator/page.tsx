import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdministratorPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const pegawai = await prisma.pegawai.findUnique({
    where: { id: parseInt(user.id as string) },
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

  const hasAccess = pegawai.aplikasi.some((pa) => pa.aplikasiId === 1);

  if (!hasAccess) {
    redirect("/login/gate");
  }

  // Redirect ke dashboard sebagai default
  redirect("/administrator/dashboard");
}
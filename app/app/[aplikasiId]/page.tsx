import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AplikasiPage({
  params,
}: {
  params: Promise<{ aplikasiId: string }> | { aplikasiId: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Handle params yang mungkin Promise (Next.js 15+) atau object biasa
  const resolvedParams = params instanceof Promise ? await params : params;
  
  // Validasi params.aplikasiId
  const aplikasiIdParam = resolvedParams?.aplikasiId;
  
  if (!aplikasiIdParam) {
    redirect("/gate");
  }

  const aplikasiId = parseInt(aplikasiIdParam);

  // Validasi jika aplikasiId bukan angka atau tidak valid
  if (isNaN(aplikasiId) || aplikasiId <= 0) {
    redirect("/gate");
  }

  // Cek apakah aplikasi adalah "Aplikasi Administrator" (id: 1)
  if (aplikasiId === 1) {
    redirect("/administrator");
  }

  // Untuk aplikasi lain, tampilkan halaman biasa
  const aplikasi = await prisma.aplikasi.findUnique({
    where: { id: aplikasiId },
  });

  if (!aplikasi) {
    redirect("/gate");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
          <h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
            {aplikasi.namaAplikasi}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selamat datang di aplikasi ini!
          </p>
        </div>
      </div>
    </div>
  );
}


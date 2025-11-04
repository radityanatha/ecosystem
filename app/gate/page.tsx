import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

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

  // Jika lebih dari 1 aplikasi → tampilkan pilihan
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-4xl px-4">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
          <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">
            Pilih Aplikasi
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Halo, {pegawai.namaPegawai}. Silakan pilih aplikasi yang ingin Anda akses.
          </p>

          {pegawai.aplikasi.length === 0 ? (
            <div className="rounded bg-yellow-100 p-4 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              Anda belum memiliki akses ke aplikasi apapun.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pegawai.aplikasi.map((pa) => (
                <a
                  key={pa.id}
                  href={`/app/${pa.aplikasiId}`}
                  className="block rounded-lg border border-gray-200 p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-400"
                >
                  <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                    {pa.aplikasi.namaAplikasi}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Klik untuk membuka aplikasi
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


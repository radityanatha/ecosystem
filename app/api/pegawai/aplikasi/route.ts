import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pegawai = await prisma.pegawai.findUnique({
    where: { id: parseInt(session.user.id) },
    include: {
      aplikasi: {
        include: {
          aplikasi: true,
        },
      },
    },
  });

  if (!pegawai) {
    return NextResponse.json({ error: "Pegawai not found" }, { status: 404 });
  }

  const aplikasi = pegawai.aplikasi.map((pa) => ({
    id: pa.id,
    aplikasiId: pa.aplikasiId,
    namaAplikasi: pa.aplikasi.namaAplikasi,
  }));

  return NextResponse.json(aplikasi);
}
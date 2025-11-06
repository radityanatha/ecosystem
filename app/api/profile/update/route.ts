import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      namaPegawai,
      email,
      noHp,
      tempatLahir,
      tanggalLahir,
      alamat,
      foto,
    } = body;

    // Update data pegawai
    const updatedPegawai = await prisma.pegawai.update({
      where: { id: parseInt(user.id as string) },
      data: {
        ...(namaPegawai && { namaPegawai }),
        ...(email && { email }),
        ...(noHp !== undefined && { noHp }),
        ...(tempatLahir !== undefined && { tempatLahir }),
        ...(tanggalLahir && {
          tanggalLahir: new Date(tanggalLahir),
        }),
        ...(alamat !== undefined && { alamat }),
        ...(foto && { foto }),
      },
      select: {
        id: true,
        namaPegawai: true,
        email: true,
        noHp: true,
        tempatLahir: true,
        tanggalLahir: true,
        alamat: true,
        foto: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPegawai,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    
    // Handle unique constraint error (email)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}


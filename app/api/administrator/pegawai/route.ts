import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil query parameters untuk pagination dan search
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const status = searchParams.get("status") || "";

    // Build where clause
    const where: any = {};

    // Filter by search (nama, email)
    if (search) {
      where.OR = [
        { namaPegawai: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by status (aktif)
    if (status) {
      where.aktif = status === "Active" ? "Y" : "N";
    }

    // Get total count
    const total = await prisma.pegawai.count({ where });

    // Get pegawai data with pagination
    const pegawaiList = await prisma.pegawai.findMany({
      where,
      include: {
        role: {
          select: {
            namaRole: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data untuk table
    const data = pegawaiList.map((pegawai) => ({
      id: pegawai.id.toString(),
      name: pegawai.namaPegawai,
      email: pegawai.email || "-",
      status: pegawai.aktif === "Y" ? "Active" : "Inactive",
      role: pegawai.role?.namaRole || "-",
      noHp: pegawai.noHp || "-",
      tempatLahir: pegawai.tempatLahir || "-",
      tanggalLahir: pegawai.tanggalLahir
        ? new Date(pegawai.tanggalLahir).toLocaleDateString("id-ID")
        : "-",
      alamat: pegawai.alamat || "-",
      foto: pegawai.foto,
      statusPegawai: pegawai.statusPegawai || "-",
      createdAt: pegawai.createdAt.toLocaleDateString("id-ID"),
    }));

    // If requesting status counts only (without search filter)
    if (searchParams.get("countOnly") === "true") {
      const activeCount = await prisma.pegawai.count({
        where: { aktif: "Y" },
      });
      const inactiveCount = await prisma.pegawai.count({
        where: { aktif: "N" },
      });
      
      return NextResponse.json({
        Active: activeCount,
        Inactive: inactiveCount,
      });
    }

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: any) {
    console.error("Get pegawai error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      namaPegawai,
      email,
      password,
      noHp,
      tempatLahir,
      tanggalLahir,
      alamat,
      masaKerjaTahun,
      masaKerjaBulan,
      statusPegawai,
      roleId,
      aktif,
      foto,
    } = body;

    // Validasi required fields
    if (!namaPegawai || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create pegawai
    const newPegawai = await prisma.pegawai.create({
      data: {
        namaPegawai,
        email,
        password: hashedPassword,
        noHp: noHp || null,
        tempatLahir: tempatLahir || null,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        alamat: alamat || null,
        masaKerjaTahun: masaKerjaTahun ? parseInt(masaKerjaTahun) : null,
        masaKerjaBulan: masaKerjaBulan ? parseInt(masaKerjaBulan) : null,
        statusPegawai: statusPegawai || "PNS",
        roleId: roleId ? parseInt(roleId) : null,
        aktif: aktif || "Y",
        gantiPassword: "Y",
        foto: foto || null,
      },
      include: {
        role: {
          select: {
            namaRole: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newPegawai.id.toString(),
        name: newPegawai.namaPegawai,
        email: newPegawai.email || "-",
        status: newPegawai.aktif === "Y" ? "Active" : "Inactive",
        role: newPegawai.role?.namaRole || "-",
        noHp: newPegawai.noHp || "-",
        tempatLahir: newPegawai.tempatLahir || "-",
        tanggalLahir: newPegawai.tanggalLahir
          ? new Date(newPegawai.tanggalLahir).toLocaleDateString("id-ID")
          : "-",
        alamat: newPegawai.alamat || "-",
        foto: newPegawai.foto,
        statusPegawai: newPegawai.statusPegawai || "-",
        createdAt: newPegawai.createdAt.toLocaleDateString("id-ID"),
      },
    });
  } catch (error: any) {
    console.error("Create pegawai error:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID pegawai wajib diisi" },
        { status: 400 }
      );
    }

    // Prepare update data
    const data: any = {};
    
    if (updateData.namaPegawai) data.namaPegawai = updateData.namaPegawai;
    if (updateData.email) data.email = updateData.email;
    if (updateData.noHp !== undefined) data.noHp = updateData.noHp || null;
    if (updateData.tempatLahir !== undefined) data.tempatLahir = updateData.tempatLahir || null;
    if (updateData.tanggalLahir) data.tanggalLahir = new Date(updateData.tanggalLahir);
    if (updateData.alamat !== undefined) data.alamat = updateData.alamat || null;
    if (updateData.masaKerjaTahun !== undefined) data.masaKerjaTahun = updateData.masaKerjaTahun ? parseInt(updateData.masaKerjaTahun) : null;
    if (updateData.masaKerjaBulan !== undefined) data.masaKerjaBulan = updateData.masaKerjaBulan ? parseInt(updateData.masaKerjaBulan) : null;
    if (updateData.statusPegawai) data.statusPegawai = updateData.statusPegawai;
    if (updateData.roleId !== undefined) data.roleId = updateData.roleId ? parseInt(updateData.roleId) : null;
    if (updateData.aktif) data.aktif = updateData.aktif;
    if (updateData.foto !== undefined) data.foto = updateData.foto || null;
    
    // Update password jika ada
    if (updateData.password) {
      data.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedPegawai = await prisma.pegawai.update({
      where: { id: parseInt(id) },
      data,
      include: {
        role: {
          select: {
            namaRole: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPegawai.id.toString(),
        name: updatedPegawai.namaPegawai,
        email: updatedPegawai.email || "-",
        status: updatedPegawai.aktif === "Y" ? "Active" : "Inactive",
        role: updatedPegawai.role?.namaRole || "-",
        noHp: updatedPegawai.noHp || "-",
        tempatLahir: updatedPegawai.tempatLahir || "-",
        tanggalLahir: updatedPegawai.tanggalLahir
          ? new Date(updatedPegawai.tanggalLahir).toLocaleDateString("id-ID")
          : "-",
        alamat: updatedPegawai.alamat || "-",
        foto: updatedPegawai.foto,
        statusPegawai: updatedPegawai.statusPegawai || "-",
        createdAt: updatedPegawai.createdAt.toLocaleDateString("id-ID"),
      },
    });
  } catch (error: any) {
    console.error("Update pegawai error:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID pegawai wajib diisi" },
        { status: 400 }
      );
    }

    await prisma.pegawai.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Pegawai berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Delete pegawai error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

 
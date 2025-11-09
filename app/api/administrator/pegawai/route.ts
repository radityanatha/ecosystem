import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

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


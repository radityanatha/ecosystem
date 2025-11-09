import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validasi file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP allowed" },
        { status: 400 }
      );
    }

    // Validasi file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum 5MB" },
        { status: 400 }
      );
    }

    // Buat folder jika belum ada - path dinamis
    const uploadDir = join(process.cwd(), "public", "uploads", "avatars");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Ambil foto lama dari database untuk dihapus nanti
    const pegawai = await prisma.pegawai.findUnique({
      where: { id: parseInt(user.id as string) },
      select: { foto: true },
    });

    // Generate unique filename dengan format: userId-timestamp.extension
    const timestamp = Date.now();
    const userId = user.id;
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${userId}-${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Convert file to buffer dan simpan
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Hapus foto lama jika ada dan bukan default
    if (pegawai?.foto && pegawai.foto.startsWith("/uploads/avatars/")) {
      const oldFilePath = join(process.cwd(), "public", pegawai.foto);
      if (existsSync(oldFilePath)) {
        try {
          await unlink(oldFilePath);
        } catch (error) {
          console.error("Error deleting old avatar:", error);
          // Tidak throw error, karena foto baru sudah tersimpan
        }
      }
    }

    // Return path untuk disimpan di database (path relatif dari public)
    const fileUrl = `/uploads/avatars/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}


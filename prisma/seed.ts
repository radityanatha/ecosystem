import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedRoles() {
  const roles = [
    { id: 1, namaRole: "Administrator" },
    { id: 2, namaRole: "SuperAdmin" },
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { namaRole: role.namaRole },
      update: {},
      create: { namaRole: role.namaRole },
    });
  }
}

async function seedAplikasi() {
  const aplikasiData = [
    {
      id: 1,
      namaAplikasi: "Aplikasi Administrator",
    },
    {
      id: 2,
      namaAplikasi: "Aplikasi Keuangan",
    },
    {
      id: 3,
      namaAplikasi: "Aplikasi Purchasing",
    },
    {
      id: 4,
      namaAplikasi: "Aplikasi Logistik",
    },
    {
      id: 5,
      namaAplikasi: "Aplikasi HRD",
    },
  ];

  for (const data of aplikasiData) {
    await prisma.aplikasi.upsert({
      where: { id: data.id },
      update: {
        namaAplikasi: data.namaAplikasi,
      },
      create: {
        id: data.id,
        namaAplikasi: data.namaAplikasi,
      },
    });
  }
}

async function seedPegawai() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      id: "1",
      namaPegawai: "John Doe",
      tempatLahir: "Jakarta",
      tanggalLahir: new Date("1990-01-01"),
      alamat: "Jl. Raya No. 123",
      masaKerjaTahun: 5,
      masaKerjaBulan: 3,
      statusPegawai: "PNS",
      noHp: "081234567890",
      email: "john.doe@example.com",
      password: hashedPassword,
      aktif: "Y",
      gantiPassword: "Y",
      foto: "https://via.placeholder.com/150",
      aplikasiId: "1",
    },
    {
      id: "2",
      namaPegawai: "Jane Doe",
      tempatLahir: "Jakarta",
      tanggalLahir: new Date("1990-01-01"),
      alamat: "Jl. Raya No. 123",
      masaKerjaTahun: 5,
      masaKerjaBulan: 3,
      statusPegawai: "PNS",
      noHp: "081234567890",
      email: "jane.doe@example.com",
      password: hashedPassword,
      aktif: "Y",
      gantiPassword: "Y",
      foto: "https://via.placeholder.com/150",
      aplikasiId: "1",
    },
  ]
  
}

async function main() {
  await seedRoles();
  await seedPegawai();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
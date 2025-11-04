import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedRoles() {
  const rolesData = [
    { id: 1, namaRole: "Administrator" },
    { id: 2, namaRole: "SuperAdmin" },
  ];

  for (const data of rolesData) {
    await prisma.roles.upsert({
      where: { id: data.id },
      update: {
        namaRole: data.namaRole,
      },
      create: {
        id: data.id,
        namaRole: data.namaRole,
      },
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

  const pegawaiData = [
    {
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
      roleId: 1,
      aplikasiIds: [1],  // Array - bisa 1 atau lebih
    },
    {
      namaPegawai: "Jane Doe",
      tempatLahir: "Bandung",
      tanggalLahir: new Date("1992-05-15"),
      alamat: "Jl. Sudirman No. 456",
      masaKerjaTahun: 3,
      masaKerjaBulan: 6,
      statusPegawai: "PNS",
      noHp: "081987654321",
      email: "jane.doe@example.com",
      password: hashedPassword,
      aktif: "Y",
      gantiPassword: "Y",
      foto: "https://via.placeholder.com/150",
      roleId: 2,
      aplikasiIds: [1, 2],
    },
  ];

  for (const data of pegawaiData) {
    const { aplikasiIds, ...pegawaiDataWithoutApps } = data;

    const pegawai = await prisma.pegawai.upsert({
      where: { email: data.email },
      update: {
        namaPegawai: data.namaPegawai,
        password: data.password,
        roleId: data.roleId,
      },
      create: pegawaiDataWithoutApps,
    });

    if (aplikasiIds && Array.isArray(aplikasiIds) && aplikasiIds.length > 0) {
      for (const aplikasiId of aplikasiIds) {
        await prisma.pegawaiAplikasi.upsert({
          where: {
            pegawaiId_aplikasiId: {
              pegawaiId: pegawai.id,
              aplikasiId: aplikasiId,
            },
          },
          update: {},
          create: {
            pegawaiId: pegawai.id,
            aplikasiId: aplikasiId,
          },
        });
      }
    }
  }
}

async function main() {
  await seedRoles();
  await seedAplikasi();
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
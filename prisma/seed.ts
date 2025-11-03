import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedApplication() {
  const roles = await prisma.role.upsert({
    where: { id: "1" },
    update: {},
    create: {
      name: "Administrator",
    },
  });
}

async function seedRoles() {
    const roles = [
      { name: "Administrator" },
      { name: "SuperAdmin" },
    ];
  
    for (const role of roles) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: { name: role.name },
      });
    }
  }

  async function seedUsers() {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const adminRole = await prisma.role.findUnique({
      where: { name: "Administrator" },
    });
  
    await prisma.user.upsert({
      where: { email: "admin@admin.com" },
      update: {},
      create: {
        email: "admin@admin.com",
        password: hashedPassword,
        name: "Administrator",
        roleId: adminRole?.id,
      },
      create: {
        email: "superadmin@superadmin.com",
        password: hashedPassword,
        name: "SuperAdmin",
        roleId: superAdminRole?.id,
      },
    });
  }

  async function main() {
    await seedRoles();
    await seedUsers();
  }

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
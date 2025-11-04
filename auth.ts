import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const pegawai = await prisma.pegawai.findUnique({
          where: { email: credentials.email as string },
          include: {
            role: true,
          },
        });

        if (!pegawai || pegawai.aktif !== "Y") {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          pegawai.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: pegawai.id.toString(),
          email: pegawai.email,
          name: pegawai.namaPegawai,
          roleId: pegawai.roleId?.toString(),
          roleName: pegawai.role?.namaRole,
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Pakai any untuk skip type error - cara termudah!
        (token as any).roleId = (user as any).roleId;
        (token as any).roleName = (user as any).roleName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).roleId = (token as any).roleId;
        (session.user as any).roleName = (token as any).roleName;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
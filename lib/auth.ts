import { auth } from "@/auth";

/**
 * Helper untuk mendapatkan current user di Server Components
 * @returns Current user atau null jika tidak login
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Helper untuk mendapatkan session lengkap di Server Components
 * @returns Session atau null jika tidak login
 */
export async function getSession() {
  return await auth();
}

/**
 * Helper untuk check apakah user sudah login
 * @returns true jika user login, false jika tidak
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const prisma = new PrismaClient();

export default async function AdministratorPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const roleName = (user as any).roleName;

  const pegawai = await prisma.pegawai.findUnique({
    where: { id: parseInt(user.id as string) },
    include: {
      aplikasi: {
        include: {
          aplikasi: true,
        },
      },
    },
  });

  if (!pegawai) {
    redirect("/login");
  }

  const hasAccess = pegawai.aplikasi.some((pa) => pa.aplikasiId === 1);

  if (!hasAccess) {
    redirect("/gate");
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/administrator">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {roleName === "SuperAdmin" ? "SuperAdmin" : "Administrator"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
          {roleName === "SuperAdmin" ? (
            <div>
              <h1 className="mb-4 text-3xl font-bold">
                Aplikasi Administrator - SuperAdmin
              </h1>
              <p className="mb-6 text-muted-foreground">
                Halo, {pegawai.namaPegawai}. Anda login sebagai <strong>SuperAdmin</strong>.
              </p>
              
              <div className="rounded-lg bg-blue-900 p-6">
                <h2 className="mb-4 text-xl font-semibold text-white">
                  Fitur SuperAdmin:
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-white">
                  <li>Kelola semua pegawai</li>
                  <li>Kelola semua aplikasi</li>
                  <li>Kelola semua roles</li>
                  <li>Akses penuh ke sistem</li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="mb-4 text-3xl font-bold">
                Aplikasi Administrator - Admin
              </h1>
              <p className="mb-6 text-muted-foreground">
                Halo, {pegawai.namaPegawai}. Anda login sebagai <strong>Administrator</strong>.
              </p>
              
              <div className="rounded-lg bg-green-900 p-6">
                <h2 className="mb-4 text-xl font-semibold text-white">
                  Fitur Admin:
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-white">
                  <li>Kelola pegawai</li>
                  <li>Lihat laporan</li>
                  <li>Manajemen data</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarInset>
  );
}
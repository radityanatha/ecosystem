import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const pegawai = await prisma.pegawai.findUnique({
    where: { id: parseInt(user.id as string) },
    include: {
      role: true,
    },
  });

  if (!pegawai) {
    redirect("/login");
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-1 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={pegawai.foto || "/avatars/default.jpg"} 
                    alt={pegawai.namaPegawai} 
                  />
                  <AvatarFallback className="text-2xl">
                    {pegawai.namaPegawai.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{pegawai.namaPegawai}</CardTitle>
              <CardDescription>{pegawai.role?.namaRole || "User"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile/edit">
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Detail Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>Detail lengkap profil Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <User className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                    <p className="text-base">{pegawai.namaPegawai}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base">{pegawai.email || "-"}</p>
                  </div>
                </div>

                {pegawai.noHp && (
                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">No. HP</p>
                      <p className="text-base">{pegawai.noHp}</p>
                    </div>
                  </div>
                )}

                {pegawai.tanggalLahir && (
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tanggal Lahir</p>
                      <p className="text-base">
                        {pegawai.tanggalLahir.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {pegawai.tempatLahir && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tempat Lahir</p>
                      <p className="text-base">{pegawai.tempatLahir}</p>
                    </div>
                  </div>
                )}

                {pegawai.alamat && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                      <p className="text-base">{pegawai.alamat}</p>
                    </div>
                  </div>
                )}

                {pegawai.statusPegawai && (
                  <div className="flex items-start gap-3">
                    <User className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p className="text-base">{pegawai.statusPegawai}</p>
                    </div>
                  </div>
                )}

                {(pegawai.masaKerjaTahun || pegawai.masaKerjaBulan) && (
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Masa Kerja</p>
                      <p className="text-base">
                        {pegawai.masaKerjaTahun || 0} tahun {pegawai.masaKerjaBulan || 0} bulan
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}


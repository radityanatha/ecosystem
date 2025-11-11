"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, Edit, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditProfileModal } from "@/components/edit-profile-modal";

interface Pegawai {
  id: number;
  namaPegawai: string;
  email: string | null;
  noHp: string | null;
  tempatLahir: string | null;
  tanggalLahir: Date | null;
  alamat: string | null;
  foto: string | null;
  statusPegawai?: string | null;
  masaKerjaTahun?: number | null;
  masaKerjaBulan?: number | null;
  role?: {
    namaRole: string;
  } | null;
}

interface ProfileContentProps {
  pegawai: Pegawai;
}

export function ProfileContent({ pegawai }: ProfileContentProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Header untuk Foto Profile
  const ProfileHeader = () => (
    <div className="flex items-center justify-center p-6">
      <Avatar className="h-24 w-24 md:h-28 md:w-28">
        <AvatarImage 
          src={pegawai.foto ? (pegawai.foto.startsWith("/") ? pegawai.foto : `/uploads/avatars/${pegawai.foto}`) : undefined}
          alt={pegawai.namaPegawai} 
        />
        <AvatarFallback className="text-2xl md:text-3xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
          {pegawai.namaPegawai.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );

  // Content untuk informasi profile
  const ProfileInfoContent = () => (
    <div className="flex flex-col h-full">
      {/* Nama dan Role */}
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-600 dark:text-neutral-200 mb-1">
          {pegawai.namaPegawai}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {pegawai.role?.namaRole || "User"}
        </p>
      </div>

      {/* Informasi Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="flex items-start gap-2">
          <Mail className="h-3.5 w-3.5 mt-0.5 text-neutral-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Email</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
              {pegawai.email || "-"}
            </p>
          </div>
        </div>

        {/* No. HP */}
        {pegawai.noHp && (
          <div className="flex items-start gap-2">
            <Phone className="h-3.5 w-3.5 mt-0.5 text-neutral-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">No. HP</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{pegawai.noHp}</p>
            </div>
          </div>
        )}

        {/* Tanggal Lahir */}
        {pegawai.tanggalLahir && (
          <div className="flex items-start gap-2">
            <Calendar className="h-3.5 w-3.5 mt-0.5 text-neutral-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Tanggal Lahir</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {new Date(pegawai.tanggalLahir).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Tempat Lahir */}
        {pegawai.tempatLahir && (
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 mt-0.5 text-neutral-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Tempat Lahir</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{pegawai.tempatLahir}</p>
            </div>
          </div>
        )}

        {/* Masa Kerja */}
        {(pegawai.masaKerjaTahun || pegawai.masaKerjaBulan) && (
          <div className="flex items-start gap-2">
            <Briefcase className="h-3.5 w-3.5 mt-0.5 text-neutral-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Masa Kerja</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {pegawai.masaKerjaTahun || 0} tahun {pegawai.masaKerjaBulan || 0} bulan
              </p>
            </div>
          </div>
        )}

        {/* Alamat - Full Width */}
        {pegawai.alamat && (
          <div className="flex items-start gap-2 md:col-span-2">
            <MapPin className="h-3.5 w-3.5 mt-0.5 text-neutral-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Alamat</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{pegawai.alamat}</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Button */}
      <div className="mt-4 md:mt-6">
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
        >
          <Edit className="h-3 w-3" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="h-full w-full">
        <div className={cn(
          "group/bento shadow-input flex flex-col border border-neutral-200 bg-white p-6 md:p-8 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
          "h-full w-full"
        )}>
          <div className="flex flex-col md:flex-row h-full gap-6 md:gap-8">
            {/* Foto Profile - Kiri */}
            <div className="flex-shrink-0 flex items-center justify-center md:items-start md:justify-start">
              <ProfileHeader />
            </div>
            
            {/* Content - Kanan */}
            <div className="flex-1 min-w-0 flex flex-col">
              <ProfileInfoContent />
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        pegawai={pegawai}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </>
  );
}


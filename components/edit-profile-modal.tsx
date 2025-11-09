"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUpload } from "@/components/avatar-upload";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, ChevronDownIcon } from "lucide-react";
import "react-day-picker/dist/style.css";

interface Pegawai {
  id: number;
  namaPegawai: string;
  email: string | null;
  noHp: string | null;
  tempatLahir: string | null;
  tanggalLahir: Date | null;
  alamat: string | null;
  foto: string | null;
}

interface EditProfileModalProps {
  pegawai: Pegawai;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({ pegawai, open, onOpenChange }: EditProfileModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(pegawai.foto || "");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [tanggalLahir, setTanggalLahir] = useState<Date | undefined>(
    pegawai.tanggalLahir ? new Date(pegawai.tanggalLahir) : undefined
  );
  
  const [formData, setFormData] = useState({
    namaPegawai: pegawai.namaPegawai || "",
    email: pegawai.email || "",
    noHp: pegawai.noHp || "",
    tempatLahir: pegawai.tempatLahir || "",
    alamat: pegawai.alamat || "",
  });

  // Reset state ketika modal dibuka atau pegawai berubah
  useEffect(() => {
    if (open) {
      setAvatarUrl(pegawai.foto || "");
      setTanggalLahir(pegawai.tanggalLahir ? new Date(pegawai.tanggalLahir) : undefined);
      setFormData({
        namaPegawai: pegawai.namaPegawai || "",
        email: pegawai.email || "",
        noHp: pegawai.noHp || "",
        tempatLahir: pegawai.tempatLahir || "",
        alamat: pegawai.alamat || "",
      });
    }
  }, [open, pegawai]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tanggalLahir: tanggalLahir ? tanggalLahir.toISOString().split("T")[0] : "",
          foto: avatarUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        alert(data.error || "Gagal memperbarui profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Terjadi kesalahan saat memperbarui profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Perbarui informasi profil Anda. Klik simpan ketika selesai.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-4">
            {/* Foto Profil */}
            <Field>
              <FieldLabel>Foto Profil</FieldLabel>
              <div className="flex justify-center py-4">
                <AvatarUpload
                  currentAvatar={pegawai.foto || ""}
                  currentName={pegawai.namaPegawai}
                  onUploadSuccess={(url) => setAvatarUrl(url)}
                />
              </div>
            </Field>

            {/* Nama Lengkap */}
            <Field>
              <FieldLabel htmlFor="namaPegawai">Nama Lengkap *</FieldLabel>
              <Input
                id="namaPegawai"
                name="namaPegawai"
                value={formData.namaPegawai}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email *</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              {/* No. HP */}
              <Field>
                <FieldLabel htmlFor="noHp">No. HP</FieldLabel>
                <Input
                  id="noHp"
                  name="noHp"
                  type="tel"
                  value={formData.noHp}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Field>

              {/* Tempat Lahir */}
              <Field>
                <FieldLabel htmlFor="tempatLahir">Tempat Lahir</FieldLabel>
                <Input
                  id="tempatLahir"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Field>
            </div>

            {/* Tanggal Lahir */}
            <Field>
              <FieldLabel htmlFor="tanggalLahir">Tanggal Lahir</FieldLabel>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="tanggalLahir"
                    className="w-full justify-between font-normal"
                    disabled={loading}
                  >
                    {tanggalLahir ? tanggalLahir.toLocaleDateString("id-ID") : "Pilih tanggal"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tanggalLahir}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setTanggalLahir(date);
                      setDatePickerOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>

            {/* Alamat */}
            <Field>
              <FieldLabel htmlFor="alamat">Alamat</FieldLabel>
              <Textarea
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                disabled={loading}
                rows={3}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


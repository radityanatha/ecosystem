"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvatarUpload } from "@/components/avatar-upload";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, ChevronDownIcon } from "lucide-react";
import "react-day-picker/dist/style.css";

interface Role {
  id: number;
  namaRole: string;
}

interface PegawaiFormData {
  id?: string;
  namaPegawai: string;
  email: string;
  password?: string;
  noHp: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  masaKerjaTahun: string;
  masaKerjaBulan: string;
  statusPegawai: string;
  roleId: string;
  aktif: string;
  foto: string;
}

interface PegawaiFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  pegawai?: {
    id: string;
    name: string;
    email: string;
    noHp: string;
    tempatLahir: string;
    tanggalLahir: string;
    alamat: string;
    foto: string | null;
    statusPegawai: string;
    role: string;
  } | null;
}

export function PegawaiFormModal({
  open,
  onOpenChange,
  onSuccess,
  pegawai,
}: PegawaiFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [tanggalLahir, setTanggalLahir] = useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState<PegawaiFormData>({
    namaPegawai: "",
    email: "",
    password: "",
    noHp: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    masaKerjaTahun: "",
    masaKerjaBulan: "",
    statusPegawai: "PNS",
    roleId: "",
    aktif: "Y",
    foto: "",
  });

  // Fetch roles
  useEffect(() => {
    if (open) {
      fetch("/api/administrator/roles")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setRoles(data);
          }
        })
        .catch((error) => console.error("Error fetching roles:", error));
    }
  }, [open]);

  // Reset form when modal opens/closes or pegawai changes
  useEffect(() => {
    if (open) {
      if (pegawai) {
        // Edit mode
        setAvatarUrl(pegawai.foto || "");
        setTanggalLahir(
          pegawai.tanggalLahir && pegawai.tanggalLahir !== "-"
            ? new Date(pegawai.tanggalLahir.split("/").reverse().join("-"))
            : undefined
        );
        
        // Find role ID from role name (wait for roles to load)
        const roleId = roles.length > 0 
          ? (roles.find((r) => r.namaRole === pegawai.role)?.id.toString() || "")
          : "";
        
        setFormData({
          id: pegawai.id,
          namaPegawai: pegawai.name || "",
          email: pegawai.email || "",
          password: "",
          noHp: pegawai.noHp !== "-" ? pegawai.noHp : "",
          tempatLahir: pegawai.tempatLahir !== "-" ? pegawai.tempatLahir : "",
          tanggalLahir: "",
          alamat: pegawai.alamat !== "-" ? pegawai.alamat : "",
          masaKerjaTahun: "",
          masaKerjaBulan: "",
          statusPegawai: pegawai.statusPegawai || "PNS",
          roleId: roleId,
          aktif: "Y",
          foto: pegawai.foto || "",
        });
      } else {
        // Create mode
        setAvatarUrl("");
        setTanggalLahir(undefined);
        setFormData({
          namaPegawai: "",
          email: "",
          password: "",
          noHp: "",
          tempatLahir: "",
          tanggalLahir: "",
          alamat: "",
          masaKerjaTahun: "",
          masaKerjaBulan: "",
          statusPegawai: "PNS",
          roleId: "",
          aktif: "Y",
          foto: "",
        });
      }
    }
  }, [open, pegawai, roles]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData: any = {
        ...formData,
        tanggalLahir: tanggalLahir ? tanggalLahir.toISOString().split("T")[0] : "",
        foto: avatarUrl,
      };

      // Remove password if empty in edit mode
      if (pegawai && !submitData.password) {
        delete submitData.password;
      }

      const url = `/api/administrator/pegawai`;
      const method = pegawai ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        onOpenChange(false);
        onSuccess();
      } else {
        alert(data.error || "Gagal menyimpan data pegawai");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {pegawai ? "Edit Pegawai" : "Tambah Pegawai Baru"}
          </DialogTitle>
          <DialogDescription>
            {pegawai
              ? "Perbarui informasi pegawai. Klik simpan ketika selesai."
              : "Isi form untuk menambahkan pegawai baru. Klik simpan ketika selesai."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-4">
            {/* Foto Profil */}
            <Field>
              <FieldLabel>Foto Profil</FieldLabel>
              <div className="flex justify-center py-4">
                <AvatarUpload
                  currentAvatar={avatarUrl}
                  currentName={formData.namaPegawai || "Pegawai"}
                  onUploadSuccess={(url) => setAvatarUrl(url)}
                />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">
                  Password {pegawai ? "(kosongkan jika tidak diubah)" : "*"}
                </FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!pegawai}
                  disabled={loading}
                />
              </Field>

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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                      type="button"
                    >
                      {tanggalLahir
                        ? tanggalLahir.toLocaleDateString("id-ID")
                        : "Pilih tanggal"}
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
            </div>

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

            <div className="grid grid-cols-3 gap-4">
              {/* Masa Kerja Tahun */}
              <Field>
                <FieldLabel htmlFor="masaKerjaTahun">Masa Kerja (Tahun)</FieldLabel>
                <Input
                  id="masaKerjaTahun"
                  name="masaKerjaTahun"
                  type="number"
                  value={formData.masaKerjaTahun}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                />
              </Field>

              {/* Masa Kerja Bulan */}
              <Field>
                <FieldLabel htmlFor="masaKerjaBulan">Masa Kerja (Bulan)</FieldLabel>
                <Input
                  id="masaKerjaBulan"
                  name="masaKerjaBulan"
                  type="number"
                  value={formData.masaKerjaBulan}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  max="11"
                />
              </Field>

              {/* Status Pegawai */}
              <Field>
                <FieldLabel htmlFor="statusPegawai">Status Pegawai</FieldLabel>
                <Select
                  value={formData.statusPegawai}
                  onValueChange={(value) => handleSelectChange("statusPegawai", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PNS">PNS</SelectItem>
                    <SelectItem value="CPNS">CPNS</SelectItem>
                    <SelectItem value="Honor">Honor</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Role */}
              <Field>
                <FieldLabel htmlFor="roleId">Role</FieldLabel>
                <Select
                  value={formData.roleId}
                  onValueChange={(value) => handleSelectChange("roleId", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.namaRole}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Status Aktif */}
              <Field>
                <FieldLabel htmlFor="aktif">Status Aktif</FieldLabel>
                <Select
                  value={formData.aktif}
                  onValueChange={(value) => handleSelectChange("aktif", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Active</SelectItem>
                    <SelectItem value="N">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
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
              {pegawai ? "Simpan Perubahan" : "Tambah Pegawai"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


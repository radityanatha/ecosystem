"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatar?: string;
  currentName?: string;
  onUploadSuccess?: (url: string) => void;
}

export function AvatarUpload({
  currentAvatar,
  currentName = "User",
  onUploadSuccess,
}: AvatarUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>(currentAvatar || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validasi file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.");
        return;
      }

      // Validasi file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        alert("Ukuran file terlalu besar. Maksimal 5MB.");
        return;
      }

      setFile(selectedFile);
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAvatarUrl(data.url);
        setFile(null);
        setPreview("");
        if (onUploadSuccess) {
          onUploadSuccess(data.url);
        }
      } else {
        alert(data.error || "Gagal mengupload foto");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Terjadi kesalahan saat mengupload foto");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview("");
  };

  if (uploading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={preview || (avatarUrl ? (avatarUrl.startsWith("/") ? avatarUrl : `/uploads/avatars/${avatarUrl}`) : undefined)}
            alt={currentName}
          />
          <AvatarFallback className="text-2xl">
            {currentName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Format: JPEG, PNG, atau WebP. Maksimal 5MB
          </p>
        </div>
      </div>
      {preview && (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUpload}
            disabled={uploading}
            size="sm"
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Foto"}
          </Button>
          <Button
            onClick={handleRemove}
            disabled={uploading}
            size="sm"
            variant="ghost"
          >
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
        </div>
      )}
    </div>
  );
}


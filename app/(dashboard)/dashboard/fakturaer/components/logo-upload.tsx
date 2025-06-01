"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface LogoUploadProps {
  logo?: string;
  onLogoChange: (logo?: string) => void;
}

export function LogoUpload({ logo, onLogoChange }: LogoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.match("image.*")) {
      alert("Vennligst velg en bildefil (JPG, PNG, etc.)");
      return;
    }

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      alert("Bildet er for stort. Maksimal størrelse er 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      onLogoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(undefined);
    onLogoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="logo-upload">Bedriftslogo</Label>

      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          id="logo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Last opp logo
        </Button>

        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemoveLogo}
            className="text-destructive"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fjern logo</span>
          </Button>
        )}
      </div>

      {previewUrl && (
        <div className="mt-2">
          <div className="border rounded-md p-4 bg-gray-50 flex items-center justify-center">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Bedriftslogo"
              className="max-h-24 max-w-full object-contain"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Logoen vil vises øverst på fakturaen
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Check, FileImage } from "lucide-react";

interface Image {
  id: string;
  url: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (images: Image[]) => void;
  multiSelect?: boolean;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  open,
  onClose,
  onSelect,
  multiSelect = true,
}) => {
  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    setIsUploading(true);
    const fileArray = Array.from(files);

    // Only filter image files
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      alert("Lütfen sadece resim dosyaları seçin.");
      setIsUploading(false);
      return;
    }

    const newImages: Image[] = [];

    for (const file of imageFiles) {
      try {
        // Convert file to base64 for preview
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = () => {
            const newImage: Image = {
              id:
                Date.now().toString() + Math.random().toString(36).substr(2, 9),
              url: reader.result as string,
              name: file.name,
              size: formatFileSize(file.size),
              uploadDate: new Date().toLocaleDateString("tr-TR"),
            };
            newImages.push(newImage);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      } catch (error) {
        console.error("Dosya yüklenirken hata oluştu:", error);
      }
    }

    setUploadedImages((prev) => [...prev, ...newImages]);
    setIsUploading(false);
  };

  const handleImageSelect = (imageId: string) => {
    if (multiSelect) {
      setSelectedImages((prev) =>
        prev.includes(imageId)
          ? prev.filter((id) => id !== imageId)
          : [...prev, imageId]
      );
    } else {
      setSelectedImages([imageId]);
    }
  };

  const handleConfirmSelection = () => {
    const selected = uploadedImages.filter((img) =>
      selectedImages.includes(img.id)
    );
    onSelect(selected);
    setSelectedImages([]);
    onClose();
  };

  const handleRemoveImage = (imageId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    setSelectedImages((prev) => prev.filter((id) => id !== imageId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[90vw] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Resim Yükle
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload
              className={`h-12 w-12 mx-auto mb-4 ${
                dragOver ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <h3 className="text-lg font-medium mb-2">
              {isUploading ? "Yükleniyor..." : "Dosyaları buraya sürükleyin"}
            </h3>
            <p className="text-gray-600 mb-4">
              veya bir dosya seçmek için tıklayın
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="file-upload"
              disabled={isUploading}
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(e.target.files);
                }
              }}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                className="cursor-pointer"
                disabled={isUploading}
              >
                {isUploading ? "Yükleniyor..." : "Dosya Seç"}
              </Button>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Desteklenen formatlar: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">Yüklenen Resimler</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all group ${
                      selectedImages.includes(image.id)
                        ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                    onClick={() => handleImageSelect(image.id)}
                  >
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <img
                        src={image.url}
                        alt={image.name}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          selectedImages.includes(image.id)
                            ? "scale-105"
                            : "group-hover:scale-105"
                        }`}
                      />

                      {/* Remove button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white border-none p-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(image.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>

                      {/* Selection overlay */}
                      {selectedImages.includes(image.id) && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-3 ${
                        selectedImages.includes(image.id)
                          ? "bg-blue-50"
                          : "bg-white"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium truncate ${
                          selectedImages.includes(image.id)
                            ? "text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        {image.name}
                      </p>
                      <p
                        className={`text-xs ${
                          selectedImages.includes(image.id)
                            ? "text-blue-700"
                            : "text-gray-500"
                        }`}
                      >
                        {image.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {uploadedImages.length === 0 && !isUploading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileImage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Henüz resim yüklenmedi</p>
                <p className="text-sm text-gray-400">
                  Yukarıdaki alana dosyalarınızı sürükleyin
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedImages.length} resim seçildi
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button
              onClick={handleConfirmSelection}
              disabled={selectedImages.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Seç ({selectedImages.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;

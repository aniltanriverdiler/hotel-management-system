"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import Image from "next/image";

interface CategoryFormData {
  productName: string;
  categoryIcon: string;
  uploadedImages: File[];
}

const NewCategoryForm: React.FC = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    productName: "",
    categoryIcon: "",
    uploadedImages: [],
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (
    field: keyof CategoryFormData,
    value: string | File[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleInputChange("uploadedImages", [
        ...formData.uploadedImages,
        ...files,
      ]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleInputChange("uploadedImages", [
        ...formData.uploadedImages,
        ...files,
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const iconOptions = [
    { value: "🏨", label: "Hotel" },
    { value: "🏛️", label: "Boutique Hotel" },
    { value: "🏖️", label: "Beach Resort" },
    { value: "🏔️", label: "Mountain Villa" },
    { value: "🏙️", label: "City Hotel" },
    { value: "💼", label: "Business Hotel" },
    { value: "🧘", label: "Spa & Wellness" },
    { value: "🏰", label: "Historic Hotel" },
    { value: "🌊", label: "Seaside Villa" },
    { value: "🌿", label: "Eco Lodge" },
  ];

  return (
    <Card className="bg-white shadow-sm border-0">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Name */}
          <div className="space-y-3">
            <Label
              htmlFor="productName"
              className="text-base font-medium text-gray-900"
            >
              Product name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="productName"
              placeholder="Category name"
              value={formData.productName}
              onChange={(e) => handleInputChange("productName", e.target.value)}
              className="h-12 text-base border-gray-200 rounded-lg"
              required
            />
          </div>

          {/* Upload Images */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-900">
              Upload images <span className="text-red-500">*</span>
            </Label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-blue-300 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 text-base">
                    Drop your images here or select{" "}
                    <label
                      htmlFor="fileInput"
                      className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium"
                    >
                      click to browse
                    </label>
                  </p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </div>

            {/* Display uploaded images */}
            {formData.uploadedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {formData.uploadedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-20 object-cover rounded-lg border"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.uploadedImages.filter(
                          (_, i) => i !== index
                        );
                        handleInputChange("uploadedImages", newImages);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Select Category Icon */}
          <div className="space-y-3">
            <Label
              htmlFor="categoryIcon"
              className="text-base font-medium text-gray-900"
            >
              Select category icon
            </Label>
            <Select
              value={formData.categoryIcon}
              onValueChange={(value: string) =>
                handleInputChange("categoryIcon", value)
              }
            >
              <SelectTrigger className="h-12 text-base border-gray-200 rounded-lg">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{option.value}</span>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium rounded-lg"
              disabled={
                !formData.productName.trim() ||
                formData.uploadedImages.length === 0
              }
            >
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewCategoryForm;

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WysiwygEditor from "./WysiwygEditor";
import GalleryModal from "./GalleryModal";
import { Save, ArrowLeft, Upload, Eye, Plus, X } from "lucide-react";

interface NewPageFormProps {
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

const NewPageForm: React.FC<NewPageFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    template: "default",
    content: "",
    metaTitle: "",
    metaDescription: "",
    status: "draft",
    selectedImages: [] as any[],
  });
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };

  const handleImageSelect = (images: any[]) => {
    setFormData((prev) => ({
      ...prev,
      selectedImages: [...prev.selectedImages, ...images],
    }));
  };

  const handleRemoveImage = (imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedImages: prev.selectedImages.filter((img) => img.id !== imageId),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              New Page
            </h1>
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="hover:text-blue-600 cursor-pointer">
                Dashboard
              </span>
              <span>›</span>
              <span className="hover:text-blue-600 cursor-pointer">Page</span>
              <span>›</span>
              <span className="text-gray-900 font-medium">Edit Page</span>
            </nav>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content - Left side (3/4) */}
            <div className="lg:col-span-3">
              <Card className="bg-white">
                {/* Tabs */}
                <Tabs defaultValue="detail" className="w-full">
                  <div className="border-b border-gray-200 px-6 pt-6">
                    <TabsList className="bg-transparent p-0 h-auto">
                      <TabsTrigger
                        value="detail"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2"
                      >
                        Detail
                      </TabsTrigger>
                      <TabsTrigger
                        value="revision"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2"
                      >
                        Revision history
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="detail" className="p-6 space-y-6">
                    {/* Name */}
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Name"
                        className="mt-1"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.metaDescription}
                        onChange={(e) =>
                          handleInputChange("metaDescription", e.target.value)
                        }
                        placeholder="Description"
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    {/* Content - WYSIWYG Editor */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Content
                      </Label>
                      <WysiwygEditor
                        value={formData.content}
                        onChange={(value) =>
                          handleInputChange("content", value)
                        }
                        placeholder="Sayfa içeriğinizi buraya yazın..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="revision" className="p-6">
                    <div className="text-center py-12 text-gray-500">
                      <p>No revision history available yet.</p>
                      <p className="text-sm">
                        Save the page to start tracking revisions.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Right Sidebar (1/4) */}
            <div className="space-y-6">
              {/* Publish */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Publish</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Publish
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Status */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Status</h3>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </Card>

              {/* Template */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Template</h3>
                <select
                  value={formData.template}
                  onChange={(e) =>
                    handleInputChange("template", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="default">Default</option>
                  <option value="home">Home</option>
                  <option value="about">About</option>
                  <option value="contact">Contact</option>
                  <option value="custom">Custom</option>
                </select>
              </Card>

              {/* Gallery */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Gallery</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsGalleryModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Resim Ekle
                  </Button>
                </div>

                {formData.selectedImages.length > 0 ? (
                  <div className="space-y-3">
                    {formData.selectedImages.map((image) => (
                      <div
                        key={image.id}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{image.name}</p>
                          <p className="text-xs text-gray-500">{image.size}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveImage(image.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => setIsGalleryModalOpen(true)}
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Resimleri seçmek için tıklayın
                      </p>
                      <p className="text-xs text-gray-500">
                        veya buraya sürükleyin
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </form>

        {/* Gallery Modal */}
        <GalleryModal
          open={isGalleryModalOpen}
          onClose={() => setIsGalleryModalOpen(false)}
          onSelect={handleImageSelect}
          multiSelect={true}
        />
      </div>
    </div>
  );
};

export default NewPageForm;

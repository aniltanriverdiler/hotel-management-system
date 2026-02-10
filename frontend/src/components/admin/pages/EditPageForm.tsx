"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save, ArrowLeft, Trash2 } from "lucide-react";

interface EditPageFormProps {
  pageId?: string;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
}

// Mock data for editing
const mockPageData = {
  id: "#01",
  name: "Home 1",
  slug: "home-1",
  template: "default",
  content: "This is the content of Home 1 page...",
  metaTitle: "Home 1 - StayEase",
  metaDescription: "Welcome to StayEase Home 1 page description.",
  status: "published",
};

const EditPageForm: React.FC<EditPageFormProps> = ({
  pageId,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [formData, setFormData] = useState(mockPageData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Here you can load page data based on pageId
    if (pageId) {
      setIsLoading(true);
      // API call simulation
      setTimeout(() => {
        setFormData(mockPageData);
        setIsLoading(false);
      }, 500);
    }
  }, [pageId]);

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

  const handleDelete = () => {
    if (confirm("Bu sayfayı silmek istediğinizden emin misiniz?")) {
      onDelete?.(formData.id);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Edit Page: {formData.name}
          </h1>
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">
              Dashboard
            </span>
            <span>›</span>
            <span className="hover:text-blue-600 cursor-pointer">Pages</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">Edit Page</span>
          </nav>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Page Information</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Page Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter page name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="page-slug"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL: /pages/{formData.slug}
                  </p>
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      handleInputChange("content", e.target.value)
                    }
                    placeholder="Page content..."
                    rows={8}
                  />
                </div>
              </div>
            </Card>

            {/* SEO Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">SEO Settings</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) =>
                      handleInputChange("metaTitle", e.target.value)
                    }
                    placeholder="Meta title for SEO"
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) =>
                      handleInputChange("metaDescription", e.target.value)
                    }
                    placeholder="Meta description for SEO"
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Page Info */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Page Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">{formData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>20 Nov 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Modified:</span>
                  <span>20 Nov 2023</span>
                </div>
              </div>
            </Card>

            {/* Publish */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Publish</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="template">Template</Label>
                  <select
                    id="template"
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
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Update Page
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, status: "draft" }));
                    onSave?.({ ...formData, status: "draft" });
                  }}
                >
                  Save as Draft
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPageForm;

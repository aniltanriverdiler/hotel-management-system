"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Upload, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryFormData {
  name: string;
  icon: string;
  isActive: boolean;
  parentCategory?: string;
}

const CategoryForm: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    icon: "",
    isActive: true,
    parentCategory: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // API call will be made here
    setIsDialogOpen(false);
    // Clear form
    setFormData({
      name: "",
      icon: "",
      isActive: true,
      parentCategory: "",
    });
  };

  const handleInputChange = (field: keyof CategoryFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex justify-end">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add new
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name *</Label>
              <Input
                id="categoryName"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            {/* Parent Category */}
            <div className="space-y-2">
              <Label htmlFor="parentCategory">Parent Category</Label>
              <Select
                value={formData.parentCategory}
                onValueChange={(value) =>
                  handleInputChange("parentCategory", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Parent</SelectItem>
                  <SelectItem value="hotels">Hotels</SelectItem>
                  <SelectItem value="villas">Villas</SelectItem>
                  <SelectItem value="resorts">Resorts</SelectItem>
                  <SelectItem value="apartments">Apartments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Icon Upload */}
            <div className="space-y-2">
              <Label>Category Icon</Label>
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload icon
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange("icon", file.name);
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!formData.name.trim()}
              >
                Add Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryForm;

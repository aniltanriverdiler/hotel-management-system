"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { userFormSchema, type UserFormData } from "@/lib/schemas";
import { ZodError } from "zod";
import PermissionSection from "./PermissionSection";

interface AddUserFormProps {
  onSubmit?: (data: UserFormData) => Promise<void>;
}

export default function AddUserForm({ onSubmit }: AddUserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    permissions: {
      addProduct: true,
      updateProduct: false,
      deleteProduct: true,
      applyDiscount: false,
      createCoupon: false,
    },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: checked,
      },
    });
  };

  const validateForm = () => {
    try {
      userFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path.join(".")] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default behavior
        console.log("Kullanıcı oluşturuluyor:", formData);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert("Kullanıcı başarıyla oluşturuldu!");
      }

      // Form reset
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        permissions: {
          addProduct: true,
          updateProduct: false,
          deleteProduct: true,
          applyDiscount: false,
          createCoupon: false,
        },
      });
    } catch (error) {
      console.error("Kullanıcı oluşturma hatası:", error);
      alert("Kullanıcı oluşturulurken bir hata oluştu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Account</CardTitle>
              <CardDescription className="text-gray-500">
                Fill in the information below to add a new account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Username"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permission Section */}
        <div>
          <PermissionSection
            permissions={formData.permissions}
            onPermissionChange={handlePermissionChange}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Kaydediliyor..." : "Save"}
        </Button>
      </div>
    </form>
  );
}

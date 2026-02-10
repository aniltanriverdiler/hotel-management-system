"use client";

import React from "react";
import Link from "next/link";
import { AddUserForm } from "@/components/admin/users";
import { UserFormData } from "@/lib/schemas";

export default function AddUserPage() {
  const handleUserSubmit = async (data: UserFormData) => {
    // TODO: API call will be made here
    console.log("Kullanıcı oluşturuluyor:", data);

    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Kullanıcı başarıyla oluşturuldu!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-gray-700">
            Dashboard
          </Link>
          <span className="mx-2">›</span>
          <Link href="/users" className="hover:text-gray-700">
            User
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Add New User</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
      </div>

      <AddUserForm onSubmit={handleUserSubmit} />
    </div>
  );
}

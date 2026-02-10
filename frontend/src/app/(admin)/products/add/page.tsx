/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import AddHotelForm from "@/components/admin/products/AddHotelForm";

const AddHotelPage: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log("Hotel form data:", data);
    // API call can be made here
  };

  const handleCancel = () => {
    // Go back to dashboard
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500">Ecommerce</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-900 font-medium">Add Hotel</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Hotel</h1>
          <p className="text-muted-foreground mt-2">
            Yeni otel bilgilerini ekleyin ve sisteme kaydedin
          </p>
        </div>

        {/* Add Hotel Form Component */}
        <AddHotelForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default AddHotelPage;

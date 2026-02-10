"use client";

import React from "react";
import NewCategoryPageHeader from "@/components/admin/categories/NewCategoryPageHeader";
import NewCategoryForm from "@/components/admin/categories/NewCategoryForm";

const NewCategoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Page Title and Breadcrumb */}
        <NewCategoryPageHeader />

        {/* New Category Form */}
        <NewCategoryForm />
      </div>
    </div>
  );
};

export default NewCategoryPage;

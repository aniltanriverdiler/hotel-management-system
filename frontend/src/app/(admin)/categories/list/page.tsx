"use client";

import React from "react";
import CategoryPageHeader from "@/components/admin/categories/CategoryPageHeader";
import CategoryTable from "@/components/admin/categories/CategoryTable";

const CategoryListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        {/* Page Title, Add New Button and Breadcrumb */}
        <CategoryPageHeader />

        {/* Current Categories Table */}
        <CategoryTable />
      </div>
    </div>
  );
};

export default CategoryListPage;

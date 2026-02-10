"use client";

import React from "react";
import PageListHeader from "@/components/admin/pages/PageListHeader";
import PageListTable from "@/components/admin/pages/PageListTable";
import { useRouter } from "next/navigation";

const PageListPage: React.FC = () => {
  const router = useRouter();

  const handleNewPage = () => {
    router.push("/pages/new");
  };

  const handleEditPage = (id: string) => {
    router.push(`/pages/edit?id=${id}`);
  };

  const handleDeletePage = (id: string) => {
    // Modal can be opened for deletion
    console.log("Delete page:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Page Title and New Button */}
        <PageListHeader title="List Page" onNewClick={handleNewPage} />

        {/* Pages Table */}
        <PageListTable onEdit={handleEditPage} onDelete={handleDeletePage} />
      </div>
    </div>
  );
};

export default PageListPage;

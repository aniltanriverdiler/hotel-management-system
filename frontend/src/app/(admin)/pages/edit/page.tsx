"use client";

import React, { Suspense } from "react";
import EditPageForm from "@/components/admin/pages/EditPageForm";
import { useRouter, useSearchParams } from "next/navigation";

const EditPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("id");

  const handleSave = (data: {
    title: string;
    content: string;
    slug: string;
  }) => {
    // API call can be made here
    console.log("Updating page:", data);

    // After successful update, redirect to list page
    router.push("/pages/list");
  };

  const handleCancel = () => {
    router.push("/pages/list");
  };

  const handleDelete = (id: string) => {
    // API call can be made here
    console.log("Deleting page:", id);

    // After successful deletion, redirect to list page
    router.push("/pages/list");
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-6">
        <EditPageForm
          pageId={pageId || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

const EditPagePage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <EditPageContent />
    </Suspense>
  );
};

export default EditPagePage;

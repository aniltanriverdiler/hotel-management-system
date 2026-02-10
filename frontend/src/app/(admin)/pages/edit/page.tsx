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
    // Burada API çağrısı yapılabilir
    console.log("Updating page:", data);

    // Başarılı güncelleme sonrası liste sayfasına yönlendir
    router.push("/pages/list");
  };

  const handleCancel = () => {
    router.push("/pages/list");
  };

  const handleDelete = (id: string) => {
    // Burada API çağrısı yapılabilir
    console.log("Deleting page:", id);

    // Başarılı silme sonrası liste sayfasına yönlendir
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

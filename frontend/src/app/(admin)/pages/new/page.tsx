"use client";

import React from "react";
import NewPageForm from "@/components/admin/pages/NewPageForm";
import { useRouter } from "next/navigation";

const NewPagePage: React.FC = () => {
  const router = useRouter();

  const handleSave = (data: any) => {
    // API call can be made here
    console.log("Saving page:", data);

    // After successful registration, redirect to list page
    router.push("/pages/list");
  };

  const handleCancel = () => {
    router.push("/pages/list");
  };

  return <NewPageForm onSave={handleSave} onCancel={handleCancel} />;
};

export default NewPagePage;

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageListHeaderProps {
  title?: string;
  onNewClick?: () => void;
}

const PageListHeader: React.FC<PageListHeaderProps> = ({
  title = "List Page",
  onNewClick,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left side - Title and Breadcrumb */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">{title}</h1>
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
          <span>›</span>
          <span className="hover:text-blue-600 cursor-pointer">Page</span>
          <span>›</span>
          <span className="text-gray-900 font-medium">{title}</span>
        </nav>
      </div>

      {/* Right side - New Button */}
      <Button
        onClick={onNewClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        New
      </Button>
    </div>
  );
};

export default PageListHeader;

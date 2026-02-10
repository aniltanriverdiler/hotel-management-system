"use client";

import React from "react";
import OrderPageHeader from "@/components/admin/orders/OrderPageHeader";
import OrderTable from "@/components/admin/orders/OrderTable";

const AllOrdersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-8 space-y-8">
        {/* Page Title */}
        <OrderPageHeader />

        {/* Order Table */}
        <OrderTable />
      </div>
    </div>
  );
};

export default AllOrdersPage;

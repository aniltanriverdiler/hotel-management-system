"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Package } from "lucide-react";

interface OrderDetailHeaderProps {
  orderId: string;
  status: "confirmed" | "pending" | "cancelled";
}

const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({
  orderId = "#7712309",
  status = "confirmed",
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium"
          >
            Onaylandı
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-medium"
          >
            Beklemede
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 px-3 py-1 text-sm font-medium"
          >
            İptal Edildi
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-800 px-3 py-1 text-sm font-medium"
          >
            Bilinmiyor
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-gray-600 hover:text-gray-900 -ml-2"
        >
          <Link href="/order/all" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Tüm Rezervasyonlara Dön
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        {/* Left Side - Page Title and Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Rezervasyon {orderId}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Rezervasyon detaylarını görüntüle ve yönet
              </p>
            </div>
          </div>
          {getStatusBadge(status)}
        </div>

        {/* Right Side - Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/order">Rezervasyon</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Rezervasyon Detayı</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default OrderDetailHeader;

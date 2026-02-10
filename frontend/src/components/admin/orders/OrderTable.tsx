"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

interface OrderData {
  id: string;
  orderID: string;
  hotelName: string;
  customerName: string;
  price: number;
  nights: number;
  guests: number;
  status: "confirmed" | "pending" | "cancelled";
  checkIn: string;
  checkOut: string;
  orderDate: string;
}

const OrderTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  // Hotel reservation orders
  const orders: OrderData[] = [
    {
      id: "1",
      orderID: "#7712309",
      hotelName: "Grand Palace Hotel İstanbul",
      customerName: "Kristin Watson",
      price: 4250.0,
      nights: 3,
      guests: 2,
      status: "confirmed",
      checkIn: "25 Jan 2024",
      checkOut: "28 Jan 2024",
      orderDate: "15 Jan 2024",
    },
    {
      id: "2",
      orderID: "#7712310",
      hotelName: "Seaside Resort Antalya",
      customerName: "Jerome Bell",
      price: 6450.0,
      nights: 5,
      guests: 4,
      status: "pending",
      checkIn: "02 Feb 2024",
      checkOut: "07 Feb 2024",
      orderDate: "16 Jan 2024",
    },
    {
      id: "3",
      orderID: "#7712311",
      hotelName: "Boutique Hotel Kapadokya",
      customerName: "Kathryn Murphy",
      price: 2940.0,
      nights: 2,
      guests: 2,
      status: "confirmed",
      checkIn: "20 Jan 2024",
      checkOut: "22 Jan 2024",
      orderDate: "17 Jan 2024",
    },
    {
      id: "4",
      orderID: "#7712312",
      hotelName: "Mountain View Resort Uludağ",
      customerName: "Jacob Jones",
      price: 5370.0,
      nights: 4,
      guests: 3,
      status: "cancelled",
      checkIn: "10 Feb 2024",
      checkOut: "14 Feb 2024",
      orderDate: "18 Jan 2024",
    },
    {
      id: "5",
      orderID: "#7712313",
      hotelName: "Luxury Villa Bodrum",
      customerName: "Courtney Henry",
      price: 7920.0,
      nights: 6,
      guests: 6,
      status: "confirmed",
      checkIn: "15 Feb 2024",
      checkOut: "21 Feb 2024",
      orderDate: "19 Jan 2024",
    },
    {
      id: "6",
      orderID: "#7712314",
      hotelName: "City Center Hotel Ankara",
      customerName: "Robert Fox",
      price: 1680.0,
      nights: 2,
      guests: 1,
      status: "pending",
      checkIn: "05 Feb 2024",
      checkOut: "07 Feb 2024",
      orderDate: "20 Jan 2024",
    },
    {
      id: "7",
      orderID: "#7712315",
      hotelName: "Spa & Wellness Hotel Pamukkale",
      customerName: "Cody Fisher",
      price: 3560.0,
      nights: 4,
      guests: 2,
      status: "confirmed",
      checkIn: "12 Feb 2024",
      checkOut: "16 Feb 2024",
      orderDate: "21 Jan 2024",
    },
    {
      id: "8",
      orderID: "#7712316",
      hotelName: "Historic Hotel Sultanahmet",
      customerName: "Theresa Webb",
      price: 2235.0,
      nights: 3,
      guests: 2,
      status: "cancelled",
      checkIn: "08 Feb 2024",
      checkOut: "11 Feb 2024",
      orderDate: "22 Jan 2024",
    },
  ];

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(
    filteredOrders.length / parseInt(entriesPerPage)
  );
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + parseInt(entriesPerPage)
  );

  const handleAction = (action: string, orderId: string) => {
    console.log(`${action} order:`, orderId);
  };

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

  const exportAllOrders = () => {
    console.log("Tüm rezervasyonlar dışa aktarılıyor...");
  };

  return (
    <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden">
      <CardContent className="p-0">
        {/* Table Top Controls */}
        <div className="p-8 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between gap-6">
            {/* Left Side - Entries and Search */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="font-medium">Gösterilen</span>
                <Select
                  value={entriesPerPage}
                  onValueChange={setEntriesPerPage}
                >
                  <SelectTrigger className="w-24 h-10 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="font-medium">kayıt</span>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-80 h-12 border-gray-200 rounded-lg text-base"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-12 border-gray-200">
                  <SelectValue placeholder="Durum seç" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="confirmed">Onaylandı</SelectItem>
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="cancelled">İptal Edildi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right Side - Export Button */}
            <div>
              <Button
                onClick={exportAllOrders}
                className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Tüm Rezervasyonları Dışa Aktar
              </Button>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50/80">
              <TableRow className="border-0">
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-4 w-[25%]">
                  Otel Adı
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-3 w-[12%]">
                  Rezervasyon ID
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-3 w-[12%]">
                  Müşteri
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-3 w-[10%]">
                  Toplam Fiyat
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-2 w-[6%] text-center">
                  Gece
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-2 w-[6%] text-center">
                  Misafir
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-3 w-[10%]">
                  Durum
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-3 w-[12%]">
                  Check-in / Check-out
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-4 w-[7%] text-center">
                  İşlem
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50/50 border-gray-100 transition-colors"
                >
                  <TableCell className="font-semibold text-gray-900 py-6 px-4 text-sm">
                    <div
                      className="truncate max-w-[200px]"
                      title={order.hotelName}
                    >
                      {order.hotelName}
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-600 font-medium py-6 px-3 text-sm">
                    {order.orderID}
                  </TableCell>
                  <TableCell className="py-6 px-3 text-sm">
                    <div
                      className="text-gray-900 font-medium truncate max-w-[120px]"
                      title={order.customerName}
                    >
                      {order.customerName}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-3 text-sm">
                    <span className="text-gray-900 font-medium">
                      ₺
                      {order.price.toLocaleString("tr-TR", {
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="py-6 px-2 text-center text-sm">
                    <span className="text-gray-900 font-medium">
                      {order.nights}
                    </span>
                  </TableCell>
                  <TableCell className="py-6 px-2 text-center text-sm">
                    <span className="text-gray-900 font-medium">
                      {order.guests}
                    </span>
                  </TableCell>
                  <TableCell className="py-6 px-3">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="py-6 px-3">
                    <div className="text-xs">
                      <div className="font-medium text-gray-900">
                        {order.checkIn}
                      </div>
                      <div className="text-gray-500">{order.checkOut}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-2">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction("view", order.id)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Görüntüle"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction("edit", order.id)}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                        title="Düzenle"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction("delete", order.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Pagination */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/30">
          <div className="flex items-center justify-between">
            <div className="text-base text-gray-600 font-medium">
              {filteredOrders.length} kayıt gösteriliyor
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-10 w-10 p-0 font-semibold ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTable;

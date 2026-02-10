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
} from "lucide-react";
import CategoryForm from "./CategoryForm";

interface CategoryData {
  id: string;
  category: string;
  icon: string;
  quantity: number;
  sale: number;
  startDate: string;
}

const CategoryTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Hotel/Villa themed categories
  const categories: CategoryData[] = [
    {
      id: "1",
      category: "Luxury Hotels",
      icon: "🏨",
      quantity: 125,
      sale: 15,
      startDate: "15 Jan 2024",
    },
    {
      id: "2",
      category: "Boutique Hotels",
      icon: "🏛️",
      quantity: 89,
      sale: 12,
      startDate: "18 Jan 2024",
    },
    {
      id: "3",
      category: "Beach Resorts",
      icon: "🏖️",
      quantity: 67,
      sale: 22,
      startDate: "20 Jan 2024",
    },
    {
      id: "4",
      category: "Mountain Villas",
      icon: "🏔️",
      quantity: 45,
      sale: 8,
      startDate: "22 Jan 2024",
    },
    {
      id: "5",
      category: "City Center Hotels",
      icon: "🏙️",
      quantity: 156,
      sale: 18,
      startDate: "25 Jan 2024",
    },
    {
      id: "6",
      category: "Business Hotels",
      icon: "💼",
      quantity: 98,
      sale: 14,
      startDate: "28 Jan 2024",
    },
    {
      id: "7",
      category: "Spa & Wellness",
      icon: "🧘",
      quantity: 34,
      sale: 25,
      startDate: "02 Feb 2024",
    },
    {
      id: "8",
      category: "Historic Hotels",
      icon: "🏰",
      quantity: 23,
      sale: 10,
      startDate: "05 Feb 2024",
    },
    {
      id: "9",
      category: "Seaside Villas",
      icon: "🌊",
      quantity: 78,
      sale: 20,
      startDate: "08 Feb 2024",
    },
    {
      id: "10",
      category: "Eco Lodges",
      icon: "🌿",
      quantity: 52,
      sale: 16,
      startDate: "12 Feb 2024",
    },
  ];

  // Filtered categories
  const filteredCategories = categories.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredCategories.length / parseInt(entriesPerPage)
  );
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + parseInt(entriesPerPage)
  );

  const handleAction = (action: string, categoryId: string) => {
    console.log(`${action} category:`, categoryId);
  };

  return (
    <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden">
      <CardContent className="p-0">
        {/* Table Top Controls */}
        <div className="p-8 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between gap-6">
            {/* Left side - Entries and Search */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="font-medium">Showing</span>
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
                <span className="font-medium">entries</span>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-80 h-12 border-gray-200 rounded-lg text-base"
                />
              </div>
            </div>

            {/* Right side - Add New Button */}
            <div>
              <CategoryForm />
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow className="border-0">
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-8">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-8">
                  Icon
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-8">
                  Quantity
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-8">
                  Sale
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-8">
                  Start date
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-base py-6 px-8 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.map((category, index) => (
                <TableRow
                  key={category.id}
                  className="hover:bg-gray-50/50 border-gray-100 transition-colors"
                >
                  <TableCell className="font-semibold text-gray-900 py-6 px-8 text-base">
                    {category.category}
                  </TableCell>
                  <TableCell className="py-6 px-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                      {category.icon}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-8">
                    <span className="text-gray-900 font-medium text-base">
                      {category.quantity.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="py-6 px-8">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium"
                    >
                      {category.sale}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 py-6 px-8 font-medium">
                    {category.startDate}
                  </TableCell>
                  <TableCell className="text-right py-6 px-8">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction("view", category.id)}
                        className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction("edit", category.id)}
                        className="h-10 w-10 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                      >
                        <Edit3 className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction("delete", category.id)}
                        className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
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
              Showing {filteredCategories.length} entries
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

export default CategoryTable;

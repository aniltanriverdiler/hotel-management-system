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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ChevronDown,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PageData {
  id: string;
  name: string;
  template: string;
  createdAt: string;
  status: "Published" | "Draft" | "Archived";
}

// Sample data
const mockPages: PageData[] = [
  {
    id: "#01",
    name: "Home 1",
    template: "Default",
    createdAt: "20 Nov 2023",
    status: "Published",
  },
  {
    id: "#02",
    name: "Home 2",
    template: "Default",
    createdAt: "20 Nov 2023",
    status: "Published",
  },
  {
    id: "#03",
    name: "Home 3",
    template: "Default",
    createdAt: "20 Nov 2023",
    status: "Published",
  },
  {
    id: "#04",
    name: "About us",
    template: "Default",
    createdAt: "20 Nov 2023",
    status: "Published",
  },
  {
    id: "#05",
    name: "Our Services",
    template: "Default",
    createdAt: "20 Nov 2023",
    status: "Published",
  },
  {
    id: "#06",
    name: "Contact",
    template: "Default",
    createdAt: "20 Nov 2023",
    status: "Published",
  },
  {
    id: "#07",
    name: "News",
    template: "Default",
    createdAt: "20 Nov 2023",
    status: "Published",
  },
  {
    id: "#08",
    name: "Product detail",
    template: "Default",
    createdAt: "20 Nov 2023",
    status: "Published",
  },
  {
    id: "#09",
    name: "Terms & Conditions",
    template: "Default",
    createdAt: "20 Nov 2023",
    status: "Published",
  },
  {
    id: "#10",
    name: "Cookie Policy",
    template: "Default",
    createdAt: "20 Nov 2023",
    status: "Published",
  },
];

interface PageListTableProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const PageListTable: React.FC<PageListTableProps> = ({ onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPages = mockPages.filter(
    (page) =>
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.template.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPages.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedPages = filteredPages.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPages(paginatedPages.map((page) => page.id));
    } else {
      setSelectedPages([]);
    }
  };

  const handleSelectPage = (pageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPages([...selectedPages, pageId]);
    } else {
      setSelectedPages(selectedPages.filter((id) => id !== pageId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {status}
          </Badge>
        );
      case "Draft":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {status}
          </Badge>
        );
      case "Archived":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Top side - Controls */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Entries dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Showing</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            {/* Bulk Action */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center gap-2">
                Bulk Action
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters */}
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedPages.length === paginatedPages.length &&
                  paginatedPages.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPages.map((page) => (
            <TableRow key={page.id}>
              <TableCell>
                <Checkbox
                  checked={selectedPages.includes(page.id)}
                  onCheckedChange={(checked) =>
                    handleSelectPage(page.id, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell className="font-medium">{page.id}</TableCell>
              <TableCell>{page.name}</TableCell>
              <TableCell>{page.template}</TableCell>
              <TableCell className="text-gray-600">{page.createdAt}</TableCell>
              <TableCell>{getStatusBadge(page.status)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(page.id)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(page.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Bottom side - Pagination */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + entriesPerPage, filteredPages.length)} of{" "}
            {filteredPages.length} records
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-blue-600 text-white" : ""}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageListTable;

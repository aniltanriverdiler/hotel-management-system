"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, Filter, RefreshCw } from "lucide-react";

interface HotelSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  entriesPerPage: number;
  onEntriesChange: (value: number) => void;
  onClearSearch?: () => void;
  totalResults?: number;
}

const HotelSearch: React.FC<HotelSearchProps> = ({
  searchTerm,
  onSearchChange,
  entriesPerPage,
  onEntriesChange,
  onClearSearch,
  totalResults,
}) => {
  return (
    <Card className="mb-6 border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Left side - Search information */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <p className="text-sm text-gray-600">
                Search by Hotel Name, Location, or ID
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 min-w-[60px] justify-between"
                  >
                    {entriesPerPage}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => onEntriesChange(5)}>
                    5 entries
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEntriesChange(10)}>
                    10 entries
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEntriesChange(25)}>
                    25 entries
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEntriesChange(50)}>
                    50 entries
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            {totalResults !== undefined && (
              <div className="text-sm text-gray-600">
                Total:{" "}
                <span className="font-semibold text-gray-900">
                  {totalResults}
                </span>{" "}
                hotels
              </div>
            )}
          </div>

          {/* Right side - Search box */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            {onClearSearch && searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSearch}
                className="h-10 px-3"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Search results summary */}
        {searchTerm && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Searching for:{" "}
                <span className="font-medium text-gray-900">
                  &ldquo;{searchTerm}&rdquo;
                </span>
              </div>
              {totalResults !== undefined && (
                <div className="text-sm text-gray-500">
                  Found {totalResults} matching results
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HotelSearch;

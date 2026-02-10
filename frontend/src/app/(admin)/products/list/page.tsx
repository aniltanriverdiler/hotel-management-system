"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import HotelList from "@/components/admin/products/HotelList";

const ProductListPage: React.FC = () => {
  // Hotel data - using the same data again
  const hotelData = [
    {
      id: "HOT001",
      name: "Grand Hotel Istanbul",
      location: "Istanbul, Turkey",
      stars: 5,
      price: "₺2,500",
      rooms: 150,
      occupancy: 85,
      status: "Available",
      startDate: "15.01.2024",
      image: "/images/hotel-img.png",
    },
    {
      id: "HOT002",
      name: "Seaside Resort Antalya",
      location: "Antalya, Turkey",
      stars: 4,
      price: "₺1,800",
      rooms: 120,
      occupancy: 92,
      status: "Available",
      startDate: "20.01.2024",
      image: "/images/hotel-img.png",
    },
    {
      id: "HOT003",
      name: "Business Hotel Ankara",
      location: "Ankara, Turkey",
      stars: 4,
      price: "₺1,200",
      rooms: 80,
      occupancy: 78,
      status: "Available",
      startDate: "18.01.2024",
      image: "/images/hotel-img.png",
    },
    {
      id: "HOT004",
      name: "Luxury Villa Bodrum",
      location: "Bodrum, Turkey",
      stars: 5,
      price: "₺3,500",
      rooms: 25,
      occupancy: 100,
      status: "Fully Booked",
      startDate: "22.01.2024",
      image: "/images/hotel-img.png",
    },
    {
      id: "HOT005",
      name: "Mountain Lodge Cappadocia",
      location: "Cappadocia, Turkey",
      stars: 3,
      price: "₺900",
      rooms: 45,
      occupancy: 65,
      status: "Available",
      startDate: "25.01.2024",
      image: "/images/hotel-img.png",
    },
    {
      id: "HOT006",
      name: "City Center Hotel Izmir",
      location: "Izmir, Turkey",
      stars: 4,
      price: "₺1,400",
      rooms: 95,
      occupancy: 88,
      status: "Available",
      startDate: "19.01.2024",
      image: "/images/hotel-img.png",
    },
    {
      id: "HOT007",
      name: "Beach Resort Fethiye",
      location: "Fethiye, Turkey",
      stars: 4,
      price: "₺2,100",
      rooms: 110,
      occupancy: 95,
      status: "Fully Booked",
      startDate: "21.01.2024",
      image: "/images/hotel-img.png",
    },
    {
      id: "HOT008",
      name: "Historic Inn Safranbolu",
      location: "Safranbolu, Turkey",
      stars: 3,
      price: "₺750",
      rooms: 35,
      occupancy: 70,
      status: "Available",
      startDate: "24.01.2024",
      image: "/images/hotel-img.png",
    },
    {
      id: "HOT009",
      name: "Ski Resort Uludag",
      location: "Bursa, Turkey",
      stars: 4,
      price: "₺1,600",
      rooms: 60,
      occupancy: 98,
      status: "Fully Booked",
      startDate: "23.01.2024",
      image: "/images/hotel-img.png",
    },
    {
      id: "HOT010",
      name: "Thermal Spa Hotel Bursa",
      location: "Bursa, Turkey",
      stars: 5,
      price: "₺2,800",
      rooms: 75,
      occupancy: 82,
      status: "Available",
      startDate: "26.01.2024",
      image: "/images/hotel-img.png",
    },
  ];

  const handleDelete = (hotelId: string) => {
    console.log("Deleting hotel:", hotelId);
    // Deletion operation can be performed here
  };

  const handleEdit = (hotelId: string) => {
    console.log("Editing hotel:", hotelId);
    // Redirect to edit page
  };

  const handleView = (hotelId: string) => {
    console.log("Viewing hotel:", hotelId);
    // Redirect to view page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500">Ecommerce</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-900 font-medium">
                    Product List
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product List</h1>
          </div>
          <Link href="/products/add">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add new
            </Button>
          </Link>
        </div>

        {/* Hotel List Component */}
        <HotelList
          hotels={hotelData}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      </div>
    </div>
  );
};

export default ProductListPage;

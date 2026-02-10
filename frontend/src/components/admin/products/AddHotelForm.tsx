"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Upload,
  X,
  Star,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
} from "lucide-react";

interface AddHotelFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

interface FormData {
  hotelName: string;
  location: string;
  city: string;
  country: string;
  stars: number;
  price: string;
  description: string;
  checkIn: string;
  checkOut: string;
  totalRooms: string;
  amenities: string[];
  roomTypes: string[];
  images: File[];
}

const AddHotelForm: React.FC<AddHotelFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    hotelName: "",
    location: "",
    city: "",
    country: "",
    stars: 3,
    price: "",
    description: "",
    checkIn: "14:00",
    checkOut: "11:00",
    totalRooms: "",
    amenities: [] as string[],
    roomTypes: [] as string[],
    images: [] as File[],
  });

  const [selectedCity, setSelectedCity] = useState("Choose city");
  const [selectedCountry, setSelectedCountry] = useState("Choose country");

  const cities = [
    "Istanbul",
    "Ankara",
    "Izmir",
    "Antalya",
    "Bursa",
    "Adana",
    "Gaziantep",
    "Konya",
  ];
  const countries = [
    "Turkey",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Belgium",
    "Switzerland",
  ];
  const amenities = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "parking", label: "Free Parking", icon: Car },
    { id: "restaurant", label: "Restaurant", icon: Utensils },
    { id: "gym", label: "Fitness Center", icon: Dumbbell },
    { id: "pool", label: "Swimming Pool", icon: Waves },
    { id: "spa", label: "Spa & Wellness" },
    { id: "concierge", label: "24/7 Concierge" },
    { id: "airport", label: "Airport Shuttle" },
  ];
  const roomTypes = [
    "Standard Room",
    "Deluxe Room",
    "Suite",
    "Family Room",
    "Executive Room",
    "Presidential Suite",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const toggleRoomType = (roomType: string) => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.includes(roomType)
        ? prev.roomTypes.filter((r) => r !== roomType)
        : [...prev.roomTypes, roomType],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageFiles],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Hotel Information */}
        <div className="space-y-6">
          {/* Hotel Name */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Label
                  htmlFor="hotelName"
                  className="text-sm font-medium text-gray-700"
                >
                  Hotel Name *
                </Label>
                <Input
                  id="hotelName"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleInputChange}
                  placeholder="Enter hotel name"
                  className="w-full"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500">
                  Otel adını girin (maksimum 50 karakter)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  Address *
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Otelin tam adresini girin
                </p>
              </div>
            </CardContent>
          </Card>

          {/* City & Country */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {selectedCity}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {cities.map((city) => (
                        <DropdownMenuItem
                          key={city}
                          onClick={() => setSelectedCity(city)}
                        >
                          {city}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Country *
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {selectedCountry}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {countries.map((country) => (
                        <DropdownMenuItem
                          key={country}
                          onClick={() => setSelectedCountry(country)}
                        >
                          {country}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stars & Price */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Star Rating *
                  </Label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, stars: star }))
                        }
                        className={`p-1 rounded hover:scale-110 transition-all duration-200 ${
                          formData.stars >= star
                            ? "text-yellow-400 hover:text-yellow-500"
                            : "text-gray-300 hover:text-gray-400"
                        }`}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            formData.stars >= star
                              ? "fill-yellow-400"
                              : "fill-none"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      ({formData.stars}{" "}
                      {formData.stars === 1 ? "yıldız" : "yıldız"})
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formData.stars} yıldızlı otel
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-700"
                  >
                    Starting Price *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₺
                    </span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-8"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Gecelik başlangıç fiyatı
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Check-in/Check-out Times */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="checkIn"
                    className="text-sm font-medium text-gray-700"
                  >
                    Check-in Time
                  </Label>
                  <Input
                    id="checkIn"
                    name="checkIn"
                    type="time"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="checkOut"
                    className="text-sm font-medium text-gray-700"
                  >
                    Check-out Time
                  </Label>
                  <Input
                    id="checkOut"
                    name="checkOut"
                    type="time"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Rooms */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Label
                  htmlFor="totalRooms"
                  className="text-sm font-medium text-gray-700"
                >
                  Total Rooms *
                </Label>
                <Input
                  id="totalRooms"
                  name="totalRooms"
                  type="number"
                  value={formData.totalRooms}
                  onChange={handleInputChange}
                  placeholder="Enter total number of rooms"
                  className="w-full"
                  min="1"
                />
                <p className="text-xs text-gray-500">
                  Oteldeki toplam oda sayısı
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Hotel Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your hotel, its unique features, and what makes it special..."
                  className="w-full resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">
                  Otel hakkında detaylı bilgi (maksimum 500 karakter)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Media, Features and Room Types */}
        <div className="space-y-6">
          {/* Upload Images */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Hotel Images
                </Label>

                {/* Image Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Existing images */}
                  {formData.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative">
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={`Hotel ${index + 1}`}
                          className="w-full h-full object-cover"
                          width={128}
                          height={128}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {/* Empty placeholders */}
                  {Array.from({
                    length: Math.max(0, 4 - formData.images.length),
                  }).map((_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                    >
                      <span className="text-gray-400 text-sm">
                        Image {formData.images.length + index + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop your images here or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("image-upload")?.click();
                    }}
                  >
                    Select Images
                  </Button>
                </div>

                <p className="text-xs text-gray-500">
                  En az 4 görsel ekleyin. Otel dış cephesi, lobi, oda ve
                  özelliklerin görsellerini ekleyin.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Hotel Amenities
                </Label>

                <div className="grid grid-cols-2 gap-3">
                  {amenities.map((amenity) => {
                    const IconComponent = amenity.icon;
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                          formData.amenities.includes(amenity.id)
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        <span className="text-sm font-medium">
                          {amenity.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Types */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Available Room Types
                </Label>

                <div className="space-y-2">
                  {roomTypes.map((roomType) => (
                    <button
                      key={roomType}
                      type="button"
                      onClick={() => toggleRoomType(roomType)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        formData.roomTypes.includes(roomType)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{roomType}</span>
                        {formData.roomTypes.includes(roomType) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Add Hotel
        </Button>
      </div>
    </form>
  );
};

export default AddHotelForm;

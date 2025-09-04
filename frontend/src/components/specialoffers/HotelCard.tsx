"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Star, MapPin, Heart, Eye, Coffee, Car } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";

// Import types from centralized location
import { HotelCardProps } from '@/types/hotel';

function HotelCard({
  image,
  title,
  location,
  price,
  rating,
  reviews,
  tag,
  amenities,
}: HotelCardProps) {
  // State for favorite status
  const [isFavorite, setIsFavorite] = useState(false);

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="w-full max-w-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-4 pb-0">
        {/* Image Section */}
        <div className="relative">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>

          {/* Discount Tag */}
          {tag && (
            <Badge className="absolute top-3 left-3 bg-[#4E946C] text-white px-2 py-1 rounded-lg text-xs font-sm font-bold flex items-center gap-1">
              <span>✨</span>
              {tag}
            </Badge>
          )}

          {/* Favorite Icon */}
          <Button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? "text-orange-500 fill-current" : "text-orange-500"
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>

        {/* Location and Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-900">{rating}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">({reviews})</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex gap-2">
            {amenities.slice(0, 2).map((amenity, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  index === 0
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <div className="flex items-center gap-1">
                  {index === 0 && <Eye className="w-3 h-3" />}
                  {index === 1 && <Coffee className="w-3 h-3" />}
                  {amenity}
                </div>
              </div>
            ))}
          </div>
          {amenities[2] && (
            <div className="mt-2">
              <div className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 inline-flex items-center gap-1">
                <Car className="w-3 h-3" />
                {amenities[2]}
              </div>
            </div>
          )}
        </div>

        {/* Price and Action Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">4 gece için</p>
            <p className="text-xl font-bold text-blue-600">{price}</p>
          </div>
          <Link href="/products/slug">
            <Button className="px-7 py-6 bg-[#2F6FED] hover:bg-[#2F6FED]/80 text-white rounded-xl transition-colors font-opensans font-bold text-sm cursor-pointer">
              Detaylı İncele
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default HotelCard;

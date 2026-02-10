import React from "react";
import Image from "next/image";
import { Star, Eye, Coffee, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function HotelInfoCard() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <CardContent className="p-4">
        {/* Hotel Image */}
        <div className="relative w-full mb-4">
          <Image
            src="/images/reservation-detail-card-img.png"
            alt="Riad Deluxe Hotel"
            width={510}
            height={262.5}
            className="w-full h-[262.5px] object-cover rounded-2xl"
          />
        </div>

        {/* Hotel Information */}
        <div className="space-y-4">
          {/* Hotel Name and Rating */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Riad Deluxe
              </h2>
              <p className="text-gray-500 font-medium">Marakeş, Fas</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">4.7</span>
              <div className="flex items-center">{renderStars(4.7)}</div>
              <span className="text-sm text-gray-500">(120)</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex gap-2">
            <div className="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Ücretsiz iptal
              </div>
            </div>
            <div className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
              <div className="flex items-center gap-1">
                <Coffee className="w-3 h-3" />
                Kahvaltı dahil
              </div>
            </div>
            <div className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
              <div className="flex items-center gap-1">
                <Car className="w-3 h-3" />
                Otopark
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default HotelInfoCard;

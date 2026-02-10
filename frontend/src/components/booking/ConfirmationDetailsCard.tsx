import React from "react";
import { Card, CardContent } from "@/components/ui/card";

function ConfirmationDetailsCard() {
  return (
    <Card className="w-full rounded-lg overflow-hidden shadow-sm border border-gray-100">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Reservation Details */}
          <div>
            <h3 className="text-[26px] font-bold font-opensans text-gray-900 mb-8">
              Rezervasyon Bilgileri
            </h3>

            {/* Check-in and Check-out Dates */}
            <div className="flex items-start gap-12 mb-8">
              {/* Check-in */}
              <div>
                <div className="text-base font-semibold text-gray-900 mb-2">
                  Giriş
                </div>
                <div className="text-xl font-bold font-opensans text-gray-900 mb-2">
                  18 Temmuz 2025
                </div>
                <div className="text-base text-gray-400 font-opensans">
                  14:00&apos;dan itibaren
                </div>
              </div>

              {/* Vertical divider */}
              <div className="w-px h-20 bg-gray-300 mx-5"></div>

              {/* Release Date */}
              <div>
                <div className="text-base font-semibold text-gray-900 mb-2">
                  Çıkış
                </div>
                <div className="text-xl font-bold font-opensans text-gray-900 mb-2">
                  22 Temmuz 2025
                </div>
                <div className="text-base text-gray-400 font-opensans">
                  12:00&apos;a kadar
                </div>
              </div>
            </div>

            {/* Room and Guest Info */}
            <div>
              <div className="text-xl font-semibold text-gray-900 font-opensans">
                Deluxe Room / 4 gece, 2 misafir
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div>
            <h3 className="text-[26px] font-bold font-opensans text-gray-900 mb-8">
              Ödeme Özeti
            </h3>

            {/* Payment Details */}
            <div className="space-y-6">
              {/* Duration and Base Price */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-opensans font-semibold text-lg">
                  4 gece
                </span>
                <span className="text-gray-500 font-opensans font-semibold text-lg">
                  30.000 TL
                </span>
              </div>

              {/* Taxes and Service Fee */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-opensans font-semibold text-lg">
                  Vergiler ve Hizmet Bedeli
                </span>
                <span className="text-gray-500 font-opensans font-semibold text-lg">
                  10.500 TL
                </span>
              </div>

              {/* Horizontal divider */}
              <div className="h-px w-full bg-gray-300 my-5"></div>

              {/* Total */}
              <div className="flex justify-between items-center pt-6">
                <span className="text-xl font-bold font-opensans text-gray-900">
                  Toplam
                </span>
                <span className="text-xl font-bold font-opensans text-blue-600">
                  40.500 TL
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ConfirmationDetailsCard;

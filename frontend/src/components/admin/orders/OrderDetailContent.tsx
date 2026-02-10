"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  MapPin,
  Users,
  CreditCard,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
} from "lucide-react";

interface ReservationItem {
  id: string;
  roomType: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
}

interface OrderDetailData {
  orderId: string;
  hotelName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: "confirmed" | "pending" | "cancelled";
  bookingDate: string;
  items: ReservationItem[];
  hotelAddress: string;
  paymentMethod: string;
  specialRequests?: string;
}

const OrderDetailContent: React.FC = () => {
  // Example reservation data - hotel themed
  const orderData: OrderDetailData = {
    orderId: "#7712309",
    hotelName: "Grand Palace Hotel İstanbul",
    customerName: "Kristin Watson",
    customerEmail: "kristin.watson@email.com",
    customerPhone: "+90 532 123 45 67",
    checkIn: "25 Jan 2024",
    checkOut: "28 Jan 2024",
    totalAmount: 4250.0,
    status: "confirmed",
    bookingDate: "15 Jan 2024",
    hotelAddress: "Sultanahmet Mah. Divanyolu Cad. No:15, Fatih/İstanbul",
    paymentMethod: "Kredi Kartı (****1234)",
    specialRequests: "Yüksek kat, deniz manzaralı oda talep edilmiştir.",
    items: [
      {
        id: "1",
        roomType: "Deluxe King Room",
        guests: 2,
        nights: 3,
        pricePerNight: 1200.0,
        totalPrice: 3600.0,
      },
      {
        id: "2",
        roomType: "Spa Package",
        guests: 2,
        nights: 1,
        pricePerNight: 650.0,
        totalPrice: 650.0,
      },
    ],
  };

  const hotelFacilities = [
    { icon: Wifi, name: "Ücretsiz WiFi" },
    { icon: Car, name: "Ücretsiz Park" },
    { icon: Coffee, name: "Kahvaltı Dahil" },
    { icon: Dumbbell, name: "Fitness Center" },
  ];

  const calculateSubtotal = () => {
    return orderData.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const taxAmount = calculateSubtotal() * 0.08;
  const serviceCharge = 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Side - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Reservation Items */}
        <Card className="shadow-sm border-0 rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Rezervasyon Kalemleri
              </CardTitle>
              <Button variant="outline" size="sm">
                Sırala
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow className="border-0">
                  <TableHead className="font-semibold text-gray-700 py-4 px-6">
                    Oda/Hizmet
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center">
                    Misafir
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center">
                    Gece
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right">
                    Gecelik Fiyat
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right">
                    Toplam
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.items.map((item) => (
                  <TableRow key={item.id} className="border-gray-100">
                    <TableCell className="py-6 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {item.roomType}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Premium oda özellikleri dahil
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{item.guests}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6 text-center">
                      <span className="font-medium">{item.nights}</span>
                    </TableCell>
                    <TableCell className="py-6 px-6 text-right font-medium">
                      ₺{item.pricePerNight.toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell className="py-6 px-6 text-right font-semibold text-gray-900">
                      ₺{item.totalPrice.toLocaleString("tr-TR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Price Summary */}
            <div className="border-t border-gray-100 bg-gray-50/30 p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span className="font-medium">
                    ₺{calculateSubtotal().toLocaleString("tr-TR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Servis Ücreti:</span>
                  <span className="font-medium">
                    ₺{serviceCharge.toLocaleString("tr-TR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vergi (%8):</span>
                  <span className="font-medium">
                    ₺{taxAmount.toLocaleString("tr-TR")}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Toplam Tutar:
                  </span>
                  <span className="text-xl font-bold text-orange-600">
                    ₺{orderData.totalAmount.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hotel Information */}
        <Card className="shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Otel Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {orderData.hotelName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">5 Yıldızlı Otel</span>
              </div>
            </div>

            <div className="text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-gray-400" />
                <span className="text-sm">{orderData.hotelAddress}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Otel Olanakları
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {hotelFacilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <facility.icon className="h-4 w-4 text-blue-600" />
                    <span>{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Summary Information */}
      <div className="space-y-6">
        {/* Reservation Summary */}
        <Card className="shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Rezervasyon Özeti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Rezervasyon ID</span>
                <div className="font-semibold text-blue-600">
                  {orderData.orderId}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">
                  Rezervasyon Tarihi
                </span>
                <div className="font-medium">{orderData.bookingDate}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Toplam Tutar</span>
                <div className="text-xl font-bold text-orange-600">
                  ₺{orderData.totalAmount.toLocaleString("tr-TR")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Müşteri Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Ad Soyad</span>
                <div className="font-medium">{orderData.customerName}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">E-posta</span>
                <div className="font-medium text-blue-600">
                  {orderData.customerEmail}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Telefon</span>
                <div className="font-medium">{orderData.customerPhone}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accommodation Information */}
        <Card className="shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              Konaklama Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Check-in</span>
                <div className="font-medium">{orderData.checkIn}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Check-out</span>
                <div className="font-medium">{orderData.checkOut}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gece Sayısı</span>
                <div className="font-medium">3 gece</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Ödeme Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Ödeme Yöntemi</span>
              <div className="font-medium">{orderData.paymentMethod}</div>
              <div className="text-xs text-gray-500 mt-1">
                Ödeme rezervasyon sırasında alınmıştır
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Requests */}
        {orderData.specialRequests && (
          <Card className="shadow-sm border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Özel İstekler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {orderData.specialRequests}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="shadow-sm border-0 rounded-xl">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Rezervasyonu Düzenle
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                Rezervasyonu İptal Et
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailContent;

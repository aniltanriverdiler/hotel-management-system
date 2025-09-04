'use client';

import React from 'react';
import { useHotels } from '@/hooks/useHotels';

interface HotelPageProps {
  city?: string;
  page?: number;
  limit?: number;
}

const HotelPage: React.FC<HotelPageProps> = ({ 
  city, 
  page = 1, 
  limit = 10 
}) => {
  const { data: hotels, loading, error, refetch } = useHotels({ city, page, limit });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">
          Oteller yükleniyor...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-lg text-red-600 mb-4 text-center">
          <h2 className="font-bold mb-2">API Bağlantı Hatası</h2>
          <p className="text-sm mb-2">Hata: {error}</p>
          <p className="text-xs text-gray-500">
            Backend server'ın çalıştığından emin olun (http://localhost:5000)
          </p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">
          {city ? `${city} şehrinde otel bulunamadı.` : 'Otel bulunamadı.'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {city ? `${city} Şehri Otelleri` : 'Tüm Oteller'}
      </h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Toplam {hotels.length} otel bulundu
        </p>
      </div>

      <ul className="space-y-4">
        {hotels.map((hotel: any) => (
          <li 
            key={hotel.id} 
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {hotel.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  📍 {hotel.location}
                </p>
                <p className="text-lg font-medium text-green-600 mb-2">
                  {hotel.price}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>⭐ {hotel.rating?.toFixed(1) || '0.0'}</span>
                  <span>💬 {hotel.reviews || 0} yorum</span>
                  {hotel.stars && <span>🏨 {hotel.stars} yıldız</span>}
                </div>
                {hotel.description && (
                  <p className="text-gray-600 mt-3 line-clamp-2">
                    {hotel.description}
                  </p>
                )}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Olanaklar:</p>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 5).map((amenity: string, index: number) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{hotel.amenities.length - 5} daha
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {hotel.image && (
                <div className="ml-4">
                  <img 
                    src={hotel.image} 
                    alt={hotel.title}
                    className="w-32 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-center">
        <button 
          onClick={() => refetch()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Listeyi Yenile
        </button>
      </div>
    </div>
  );
};

export default HotelPage;

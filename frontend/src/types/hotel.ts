// Hotel data interfaces for centralized data management

// Amenity interface with icon information
export interface Amenity {
  id: string;
  name: string;
  icon: string; // Icon name or path
  description?: string;
}

// Hotel data interface based on HotelCardProps
export interface HotelData {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  tag: string | null;
  amenities: string[];
  // Additional fields for future API integration
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  checkIn?: string;
  checkOut?: string;
  policies?: string[];
  images?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  category?: "hotel" | "villa" | "apartment" | "room";
  stars?: number;
  facilities?: string[];
  roomTypes?: {
    id: number;
    name: string;
    capacity: number;
    price: number;
    available: boolean;
  }[];
}

// Hotel card props interface (for component usage)
export interface HotelCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  tag: string | null;
  amenities: string[];
}

// Hotel filter interface for search and filtering
export interface HotelFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  amenities?: string[];
  category?: string[];
}

// Hotel search result interface
export interface HotelSearchResult {
  hotels: HotelData[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: HotelFilters;
}

// API Hotel interfaces (for backend data)
export interface APIHotelOwner {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface APIHotelRoom {
  room_id: number;
  name: string;
  capacity: number;
  price: number;
  available: boolean;
  description?: string;
  amenities?: string[];
}

export interface APIHotelImage {
  image_id?: number;
  url?: string;
  image_url?: string;
  alt_text?: string;
}

export interface APIHotel {
  hotel_id: number;
  name: string;
  city: string;
  address: string;
  description?: string;
  average_rating?: number;
  owner?: APIHotelOwner;
  rooms?: APIHotelRoom[];
  images?: APIHotelImage[];
  _count?: {
    rooms?: number;
    reservations?: number;
  };
}

export interface APIReservation {
  reservation_id: number;
  hotel_id: number;
  room_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  guest_count: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

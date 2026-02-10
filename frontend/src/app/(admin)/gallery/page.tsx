"use client";

import React, { useState } from "react";
import GalleryGrid from "@/components/admin/gallery/GalleryGrid";

interface GalleryImage {
  id: string;
  name: string;
  src: string;
  uploadedAt: string;
  modifiedAt: string;
  fullUrl: string;
}

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Selected images in the project
  const galleryImages: GalleryImage[] = [
    {
      id: "1",
      name: "antalya.png",
      src: "/images/antalya.png",
      uploadedAt: "20 Nov 2023 - 2:30 PM",
      modifiedAt: "20 Nov 2023 - 2:30 PM",
      fullUrl: "/images/antalya.png",
    },
    {
      id: "2",
      name: "paris.png",
      src: "/images/paris.png",
      uploadedAt: "20 Nov 2023 - 2:30 PM",
      modifiedAt: "20 Nov 2023 - 2:30 PM",
      fullUrl: "/images/paris.png",
    },
    {
      id: "3",
      name: "carousel-img-1.jpg",
      src: "/images/carousel-img-1.jpg",
      uploadedAt: "20 Nov 2023 - 2:30 PM",
      modifiedAt: "20 Nov 2023 - 2:30 PM",
      fullUrl: "/images/carousel-img-1.jpg",
    },
    {
      id: "4",
      name: "hotel-page-1.jpg",
      src: "/images/hotel-page-1.jpg",
      uploadedAt: "20 Nov 2023 - 2:30 PM",
      modifiedAt: "20 Nov 2023 - 2:30 PM",
      fullUrl: "/images/hotel-page-1.jpg",
    },
    {
      id: "5",
      name: "riad-deluxe-hotel-img-1.png",
      src: "/images/riad-deluxe-hotel-img-1.png",
      uploadedAt: "20 Nov 2023 - 2:30 PM",
      modifiedAt: "20 Nov 2023 - 2:30 PM",
      fullUrl: "/images/riad-deluxe-hotel-img-1.png",
    },
    {
      id: "6",
      name: "riad-deluxe-hotel-img-2.png",
      src: "/images/riad-deluxe-hotel-img-2.png",
      uploadedAt: "20 Nov 2023 - 2:30 PM",
      modifiedAt: "20 Nov 2023 - 2:30 PM",
      fullUrl: "/images/riad-deluxe-hotel-img-2.png",
    },
    {
      id: "7",
      name: "hotel-img.png",
      src: "/images/hotel-img.png",
      uploadedAt: "20 Nov 2023 - 2:30 PM",
      modifiedAt: "20 Nov 2023 - 2:30 PM",
      fullUrl: "/images/hotel-img.png",
    },
    {
      id: "8",
      name: "confirmation-card.png",
      src: "/images/confirmation-card.png",
      uploadedAt: "20 Nov 2023 - 2:30 PM",
      modifiedAt: "20 Nov 2023 - 2:30 PM",
      fullUrl: "/images/confirmation-card.png",
    },
  ];

  const handleImageSelect = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  return (
    <div className="h-screen">
      <GalleryGrid
        images={galleryImages}
        selectedImage={selectedImage}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
};

export default GalleryPage;

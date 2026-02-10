"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProductImageCarouselProps {
  images?: string[];
  className?: string;
}

export default function ProductImageCarousel({
  images,
  className,
}: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prepare fallback images and normalize to exactly 20
  const finalImages = useMemo(() => {
    const fallbackImages = [
      { src: "/images/hotel-page-1.jpg", alt: "Lüks otel havuzu ve mimari" },
      { src: "/images/hotel-page-2.jpg", alt: "Otel iç avlu ve havuz" },
      { src: "/images/hotel-page-3.jpg", alt: "Otel duvar dekorasyonu" },
      { src: "/images/hotel-page-4.jpg", alt: "Otel havuz detayı" },
      { src: "/images/hotel-page-5.jpg", alt: "Otel genel görünüm" },
      { src: "/images/hotel-page-1.jpg", alt: "Otel bahçe alanı" },
      { src: "/images/hotel-page-2.jpg", alt: "Otel lounge alanı" },
      { src: "/images/hotel-page-3.jpg", alt: "Otel spa merkezi" },
      { src: "/images/hotel-page-4.jpg", alt: "Otel fitness salonu" },
      { src: "/images/hotel-page-5.jpg", alt: "Otel restoran alanı" },
      { src: "/images/hotel-page-1.jpg", alt: "Otel bar alanı" },
      { src: "/images/hotel-page-2.jpg", alt: "Otel konferans salonu" },
      { src: "/images/hotel-page-3.jpg", alt: "Otel çocuk oyun alanı" },
      { src: "/images/hotel-page-4.jpg", alt: "Otel teras alanı" },
      { src: "/images/hotel-page-5.jpg", alt: "Otel jakuzi alanı" },
      { src: "/images/hotel-page-1.jpg", alt: "Otel sauna alanı" },
      { src: "/images/hotel-page-2.jpg", alt: "Otel kütüphane alanı" },
      { src: "/images/hotel-page-3.jpg", alt: "Otel oyun salonu" },
      { src: "/images/hotel-page-4.jpg", alt: "Otel güneşlenme alanı" },
      { src: "/images/hotel-page-5.jpg", alt: "Otel gece görünümü" },
    ];

    const mapped = (images || []).map((src, index) => ({
      id: index + 1,
      src,
      alt: `Görsel ${index + 1}`,
    }));

    const base =
      mapped.length > 0
        ? mapped
        : fallbackImages.map((f, i) => ({ id: i + 1, ...f }));
    const desired = 20;
    if (base.length === desired) return base;
    if (base.length > desired) return base.slice(0, desired);
    const result = [...base];
    let fillerIndex = 0;
    while (result.length < desired) {
      const f = fallbackImages[fillerIndex % fallbackImages.length];
      result.push({
        id: result.length + 1,
        src: f.src,
        alt: `Görsel ${result.length + 1}`,
      });
      fillerIndex += 1;
    }
    return result;
  }, [images]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? finalImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === finalImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Main Image Display */}
      <div className="relative mb-6">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
          <Image
            src={finalImages[currentIndex]?.src}
            alt={finalImages[currentIndex]?.alt}
            fill
            className="object-cover transition-all duration-500"
            priority
          />

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 backdrop-blur-sm cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 backdrop-blur-sm cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
            {currentIndex + 1} / {finalImages.length}
          </div>
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="relative px-1">
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 4,
            containScroll: "trimSnaps",
          }}
          className="w-full max-w-full"
        >
          <CarouselContent className="-ml-2 py-2">
            {finalImages.map((image, index) => (
              <CarouselItem
                key={image.id}
                className="pl-2 basis-1/5 sm:basis-1/6 md:basis-1/7 lg:basis-1/8 xl:basis-1/10"
              >
                <button
                  onClick={() => handleThumbnailClick(index)}
                  className={cn(
                    "relative w-full h-16 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg cursor-pointer",
                    currentIndex === index
                      ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-105"
                      : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons for thumbnails - positioned inside */}
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 border-gray-300 hover:bg-gray-100 shadow-md disabled:opacity-50 bg-white/90 backdrop-blur-sm cursor-pointer" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 border-gray-300 hover:bg-gray-100 shadow-md disabled:opacity-50 bg-white/90 backdrop-blur-sm cursor-pointer" />
        </Carousel>
      </div>
    </div>
  );
}

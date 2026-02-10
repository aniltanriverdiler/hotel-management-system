"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Destination data with image paths and city names
const destinations = [
  {
    id: 1,
    name: "Paris",
    image: "/images/paris.png",
    link: "/destinations/paris",
  },
  {
    id: 2,
    name: "Marakeş",
    image: "/images/marakes.png",
    link: "/destinations/marakeş",
  },
  {
    id: 3,
    name: "Roma",
    image: "/images/roma.png",
    link: "/destinations/roma",
  },
  {
    id: 4,
    name: "İzmir",
    image: "/images/izmir.png",
    link: "/destinations/izmir",
  },
  {
    id: 5,
    name: "Barselona",
    image: "/images/barselona.png",
    link: "/destinations/barselona",
  },
  {
    id: 6,
    name: "Antalya",
    image: "/images/antalya.png",
    link: "/destinations/antalya",
  },
];

// Repeat destinations multiple times for smooth infinite scrolling
const repeatedDestinations = [
  ...destinations,
  ...destinations,
  ...destinations,
  ...destinations,
].map((destination, index) => ({
  ...destination,
  id: `${destination.id}-${index + 1}`,
}));

function DestinationCarousel() {
  return (
    <div className="w-full px-24">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-8">
          {repeatedDestinations.map((destination) => (
            <CarouselItem
              key={destination.id}
              className="pl-8 basis-auto flex-shrink-0"
            >
              <Link href={destination.link} className="block group">
                <div className="relative">
                  {/* Destination Image - already has oval shape */}
                  <div className="relative w-auto h-auto">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      width={195}
                      height={305}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* City Name below the image */}
                  <div className="mt-4 text-center">
                    <h3 className="text-gray-800 font-semibold text-base">
                      {destination.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="left-8 bg-white/90 hover:bg-white text-gray-800 border-gray-200 hover:border-gray-300 shadow-lg" />
        <CarouselNext className="right-8 bg-white/90 hover:bg-white text-gray-800 border-gray-200 hover:border-gray-300 shadow-lg" />
      </Carousel>
    </div>
  );
}

export default DestinationCarousel;

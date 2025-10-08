"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

export interface ProductVariant {
  color: string;
  images: string[];
}

export interface ProductGalleryProps {
  variants: ProductVariant[];
  defaultVariantIndex?: number;
}

export default function ProductGallery({
  variants,
  defaultVariantIndex = 0,
}: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const currentVariant = variants[defaultVariantIndex];
  const validImages = currentVariant?.images?.filter(Boolean) || [];
  const hasImages = validImages.length > 0;

  // Reset image index when variant changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [defaultVariantIndex]);

  // Keyboard navigation for thumbnails
  const handleThumbnailKeyDown = (
    e: React.KeyboardEvent,
    index: number
  ) => {
    if (e.key === "ArrowRight" && index < validImages.length - 1) {
      setSelectedImageIndex(index + 1);
      e.currentTarget.nextElementSibling?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      setSelectedImageIndex(index - 1);
      e.currentTarget.previousElementSibling?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedImageIndex(index);
    }
  };

  // Empty state
  if (!hasImages) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-light-200">
          <div className="flex flex-col items-center gap-2 text-dark-500">
            <ImageOff size={48} />
            <p className="text-body">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = validImages[selectedImageIndex];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : validImages.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev < validImages.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
      {/* Thumbnails - Left side on desktop, bottom on mobile */}
      <div className="order-2 lg:order-1 lg:flex lg:w-24 lg:flex-col lg:gap-2">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              onKeyDown={(e) => handleThumbnailKeyDown(e, index)}
              className={`relative aspect-square min-w-[80px] flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700 lg:min-w-0 lg:w-full ${
                selectedImageIndex === index
                  ? "border-dark-900"
                  : "border-light-300 hover:border-dark-500"
              }`}
              aria-label={`View image ${index + 1}`}
              tabIndex={0}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Image */}
      <div className="relative order-1 lg:order-2 lg:flex-1">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-light-200">
          <Image
            src={currentImage}
            alt={`${currentVariant.color} - Image ${selectedImageIndex + 1}`}
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
            priority
          />

          {/* Navigation Arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} className="text-dark-900" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700"
                aria-label="Next image"
              >
                <ChevronRight size={24} className="text-dark-900" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

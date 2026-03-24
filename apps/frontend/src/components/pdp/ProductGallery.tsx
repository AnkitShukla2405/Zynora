"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type VariantImage = {
  key: string;
  order: number;
};

interface ProductGalleryProps {
  images: VariantImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState(0);

  React.useEffect(() => {
    setSelectedImage(0)
  }, [images])

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 rounded-xl border bg-gray-50 text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start">
      {/* Thumbnails */}
      <div className="flex gap-4 md:w-20 md:flex-col overflow-x-auto md:overflow-visible py-2 md:py-0 no-scrollbar">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white",
              selectedImage === index
                ? "border-primary ring-1 ring-primary"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${images[index].key}`}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-100 bg-white">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-300">
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${images[selectedImage].key}`}
            alt="Product image"
            fill
            className="object-contain"
            priority
          />

        </div>

        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 rounded-full bg-white/80 p-2 text-gray-700 backdrop-blur-sm shadow-sm md:hidden">
          <span className="text-xs font-medium">Pinch to zoom</span>
        </div>
      </div>
    </div>
  );
}

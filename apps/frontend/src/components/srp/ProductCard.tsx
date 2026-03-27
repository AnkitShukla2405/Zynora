"use client";

import React, { useState } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
};


type ProductCardProps = {
  product: Product;
};

export function ProductCard({product}: ProductCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = product?.images?.length;

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {product?.images?.[currentIndex] ? (
          <img
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${product.images[currentIndex]}`}
            alt={product.title}
            className="h-full w-full object-cover object-center transition-all duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* LEFT BUTTON */}
        {totalImages > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow opacity-0 transition group-hover:opacity-100 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>
        )}

        {/* RIGHT BUTTON */}
        {totalImages > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow opacity-0 transition group-hover:opacity-100 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors hover:text-red-500 hover:bg-gray-50"
          aria-label="Add to Wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              New
            </span>
          )}
          {product.isSale && (
            <span className="inline-flex rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
              Sale
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <Link
        key={product.id}
        href={`/product/${product.slug}/p/${product.id}`}
        className="block"
      >
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-gray-500">{product.brand}</p>

        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-indigo-600">
          {product.title}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            <div className="text-sm font-bold text-gray-900">
             ₹{product?.price?.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs font-medium text-gray-700">
              {product.rating}
            </span>
            <span className="text-xs text-gray-400">
              ({product.reviewCount})
            </span>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}

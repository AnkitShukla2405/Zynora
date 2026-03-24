"use client";

import React, { useMemo } from "react";
import { ProductCard } from "./ProductCard";
import Link from "next/link";
import { Product } from "./ProductCard";

type SearchResult = {
  products: Product[];
  currentPage: number;
  totalPages: number;
};
type SetPageType = (page: number) => void;

type ProductGridProps = {
  search?: SearchResult;
  setPage: SetPageType;
};
export function ProductGrid({ search, setPage }: ProductGridProps) {
  const { products = [], currentPage = 1, totalPages = 1 } = search || {};

  const getPagesNumber = () => {
    if (!totalPages || totalPages < 1) return [];
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  let pages = useMemo(() => {
    return getPagesNumber()
  }, [currentPage, totalPages])

  return (
    <div className="flex-1">
      {/* Grid - Adjusted gap for admin look (gap-6 instead of gap-10) */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination (Standard Button Style) */}
      <div className="mt-12 flex justify-center border-t border-gray-200 pt-8">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">Previous</span>
            {/* ChevronLeft */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {pages.map((item, index) =>
            item === "..." ? (
              <span
                key={index}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setPage(item as number)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 ${
                  currentPage === item
                    ? "bg-indigo-600 text-white"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ),
          )}
          <button
          disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">Next</span>
            {/* ChevronRight */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}

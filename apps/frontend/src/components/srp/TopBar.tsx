"use client";

import React from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";


const SORT_OPTIONS = [
  { label: "Relevance", value: "RELEVANCE" },
  { label: "Price: Low to High", value: "PRICE_LOW" },
  { label: "Price: High to Low", value: "PRICE_HIGH" },
  { label: "Newest", value: "NEWEST" },
];

export function TopBar({
  count = 0,
  query = "Furniture",
  onOpenFilters,
  sort,
  setFilters,
}: {
  count?: number;
  query?: string;
  onOpenFilters?: () => void;
  sort: string;
  setFilters: React.Dispatch<any>
}) {

    const currentSort = SORT_OPTIONS.find((o) => o.value === sort)
  return (
    <div className="mb-6 flex w-full flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{query}</h1>
        <p className="mt-1 text-sm text-gray-500">{count} products found</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile Filter Trigger */}
        <button
          onClick={onOpenFilters}
          className="flex lg:hidden items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {/* Sort Dropdown - Standard Select Style */}
        <div className="relative group">
          <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <span className="text-gray-500">Sort by:</span> {currentSort?.label}
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full z-10 mt-1 w-48 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-100">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => 
                    setFilters((prev: any) => ({
                        ...prev,
                        sort: opt.value,
                        page: 1
                    }))
                }
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

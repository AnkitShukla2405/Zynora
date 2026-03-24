"use client";

import React, { Dispatch, useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Filters = {
  search: string;
  category: string;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "ALL";
  minPrice: number;
  maxPrice: number;
  brands: string[];
  sort: "RELEVANCE" | "PRICE_LOW" | "PRICE_HIGH" | "NEWEST" | "TOP_RATED";
  page: number;
  limit: number;
};

// Reusable Content
function FilterContent(
    {
        filters,
        setFilters,
        brands,
    }: 
    {
        filters: Filters,
        setFilters: React.Dispatch<React.SetStateAction<Filters>>
        brands?: string[]
    }
) {
  return (
    <div className="space-y-px">
      {/* Availability */}
      <FilterSection  title="Availability">
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="stock"
              type="checkbox"
              checked={filters.stockStatus === "IN_STOCK"}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  stockStatus: e.target.checked ? "IN_STOCK" : "ALL",
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="stock" className="ml-3 text-sm text-gray-700">
              In Stock
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="sale"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="sale" className="ml-3 text-sm text-gray-700">
              On Sale
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-4">
          {/* Simplified Input Range for Admin style */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="min-price"
                className="block text-xs font-medium text-gray-500"
              >
                Min
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="min-price"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: Number(e.target.value),
                    }))
                  }
                  id="min-price"
                  className="block w-full rounded-md border-gray-300 py-1.5 pl-7 pr-12 text-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="max-price"
                className="block text-xs font-medium text-gray-500"
              >
                Max
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="max-price"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => {
                      return {
                        ...prev,
                        maxPrice: Number(e.target.value),
                      };
                    })
                  }
                  id="max-price"
                  className="block w-full rounded-md border-gray-300 py-1.5 pl-7 pr-12 text-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-3">
          {brands?.map(
            (i) => (
              <div key={i} className="flex items-center">
                <input
                  id={`brand-${i}`}
                  type="checkbox"
                  checked={filters.brands.includes(i)}
                  onChange={(e) => {
                    const checked = e.target.checked;

                    setFilters((prev) => ({
                      ...prev,
                      brands: checked
                        ? [...prev.brands, i]
                        : prev.brands.filter((b) => b !== i),
                    }));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor={`brand-${i}`}
                  className="ml-3 text-sm text-gray-700"
                >
                  {i}
                </label>
              </div>
            ),
          )}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating">
        <div className="space-y-2">
          {[4, 3, 2].map((rating) => (
            <button
              key={rating}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full p-1 rounded"
            >
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < rating ? "opacity-100" : "opacity-30"}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs">& Up</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

// Collapsible Section Component
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 group"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:text-gray-600",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen
            ? "mt-3 grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export function FilterSidebar({
  className,
  filter,
  setFilters,
  brands,
}: {
  className?: string;
  filter: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  brands?: string[]
}) {
  return (
    <div className={cn("w-64 shrink-0 hidden lg:block", className)}>
      {/* Standard Admin Panel Card Style */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
        <h2 className="sr-only">Filters</h2>
        <FilterContent filters={filter} setFilters={setFilters} brands={brands} />
      </div>
    </div>
  );
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  setFilters,
  brands
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters,
  setFilters: React.Dispatch<React.SetStateAction<Filters>>,
  brands?: string[]
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 h-[85vh] rounded-t-xl bg-white shadow-xl transition-transform duration-300 ease-out flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100/50 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <FilterContent filters={filters} setFilters={setFilters} brands={brands}/>
        </div>
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}

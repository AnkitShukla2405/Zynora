"use client"
import React, { useEffect, useState } from "react";
import { TopBar } from "@/components/srp/TopBar";
import {
  FilterSidebar,
  MobileFilterDrawer,
} from "@/components/srp/FilterSidebar";
import { ProductGrid } from "@/components/srp/ProductGrid";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import ProductNotFound from "../notFound/notFound";

type SearchResponse = {
  search: {
    products: {
      id: string;
      title: string;
      brand: string;
      price: number;
      originalPrice: number;
      slug: string;
      images: string[];
    }[];
    brand: string[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
};

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

const SEARCH = gql`
  query Search($filter: ProductFilterInput!) {
    search(filter: $filter) {
      products {
        id
        title
        brands
        price
        originalPrice
        slug
        images
      }
      brand
      totalCount
      totalPages
      currentPage
    }
  }
`;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryFormUrl = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: queryFormUrl,
    category,
    stockStatus: "IN_STOCK",
    minPrice: 0,
    maxPrice: 1000000,
    brands: [] as string[],
    sort: "RELEVANCE",
    page: 1,
    limit: 10,
  });


  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: queryFormUrl,
      page: 1
    }));
  }, [queryFormUrl]);

  const { data, loading, error } = useQuery<SearchResponse>(SEARCH, {
    fetchPolicy: "network-only",
    variables: {
      filter: filters,
    },
    context: {skipAuth: true}
  });

  if (loading) return <Loader />;

  if(!data?.search?.products?.length) return <ProductNotFound />



  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <TopBar
          count={data?.search?.totalCount}
          query={filters.search}
          onOpenFilters={() => setMobileFiltersOpen(true)}
          sort={filters.sort}
          setFilters={setFilters}
        />

        {/* Content */}
        <div className="mt-6 flex items-start gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <FilterSidebar
              filter={filters}
              setFilters={setFilters}
              brands={data?.search?.brand}
            />
          </aside>

          {/* Product Grid */}
          <section className="flex-1 min-w-0">
            <ProductGrid search={data?.search} setPage={(page) => 
              setFilters((prev) => ({
                ...prev,
                page,
              }))
            } />
          </section>
        </div>

        {/* Mobile Filters */}
        <MobileFilterDrawer
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          filters={filters}
          setFilters={setFilters}
          brands={data?.search?.brand}
        />
      </main>
    </div>
  );
}

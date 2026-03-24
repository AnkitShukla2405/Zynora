"use client";
import { ProductGallery } from "@/components/pdp/ProductGallery";
import { ProductInfo } from "@/components/pdp/ProductInfo";
import { ProductVariants } from "@/components/pdp/ProductVariants";
import { PurchaseCard } from "@/components/pdp/PurchaseCard";
import { DeliveryInfo } from "@/components/pdp/DeliveryInfo";
import { ProductTabs } from "@/components/pdp/ProductTabs";
import { RelatedProducts } from "@/components/pdp/RelatedProducts";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import Loader from "../Loader";
import toast from "react-hot-toast";
import Link from "next/link";

type Variant = {
  _id: string;
  sku: string;
  stock: number;
  attributes: {
    key: string;
    value: string;
  }[];
  variantImages: {
    key: string;
    order: number;
  }[];
};

type Product = {
  _id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  subCategory: string;
  productType: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  deliveryTime: string;
  returnPolicy: string;
  isReturnable: boolean;
  lowStockThreshold: number;

  highlights: {
    text: string;
  }[];

  specifications: {
    key: string;
    value: string;
  }[];

  variants: Variant[];
};

type GetPdpData = {
  getPdp: Product;
};

type GetPdpVars = {
  slug: string;
  id: string;
};

const GET_PDP_DATA = gql`
  query GetPDPData($slug: String!, $id: String!) {
    getPdp(slug: $slug, id: $id) {
      _id
      name
      brand
      description
      category
      subCategory
      productType
      mrp
      sellingPrice
      discountPercentage
      deliveryTime
      returnPolicy
      isReturnable
      lowStockThreshold

      highlights {
        text
      }

      specifications {
        key
        value
      }

      variants {
        _id
        sku
        stock
        attributes {
          key
          value
        }
        variantImages {
          key
          order
        }
      }
    }
  }
`;

export default function ProductDetailsClient({
  slug,
  id,
}: {
  slug: string;
  id: string;
}) {
  const { data, loading, error } = useQuery<GetPdpData, GetPdpVars>(GET_PDP_DATA, {
    variables: { slug, id },
    context: {skipAuth: true}
  });

  useEffect(() => {
  if (error) {
    console.error("GraphQL Error:", error);
    toast.error(error.message || "Something went wrong");
  }
}, [error]);

  const product = data?.getPdp;

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isReturnable, setIsReturnable] = useState(false);

  

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product?.isReturnable) {
      setIsReturnable(true);
    }
  }, [product]);

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  if (loading) return <Loader />;
  if (error) return <div>Error loading product</div>;
  if (!product) return null; 
  if (!selectedVariant) return <Loader/>;

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Breadcrumb (simplified) */}
        <nav className="mb-6 text-sm text-gray-500">
          <ol className="flex items-center gap-2">
            <Link href={"/"}  className="hover:text-gray-900 cursor-pointer">Home</Link >
            <li>/</li>
            <Link href={`/search?category=${product.category}`}  className="hover:text-gray-900 cursor-pointer">{product.category}</Link >
            <li>/</li>
            <Link href={`/search?q=${product.subCategory}`}  className="hover:text-gray-900 cursor-pointer">{product.subCategory}</Link >
            <li>/</li>
            <Link href={`/search?q=${product.productType}`}  className="hover:text-gray-900 cursor-pointer">{product.productType}</Link >
          </ol>
        </nav>

        {/* Top Section: Gallery & Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Left Column: Gallery (7 cols) */}
          <div className="md:col-span-7 lg:col-span-7">
            <ProductGallery images={selectedVariant?.variantImages ?? []} />
          </div>

          {/* Right Column: Info & Actions (5 cols) */}
          <div className="md:col-span-5 lg:col-span-5 space-y-8">
            <ProductInfo
              name={product.name}
              brand={product.brand}
              mrp={product.mrp}
              sellingPrice={product.sellingPrice}
              discountPercentage={product.discountPercentage}
            />
            <div className="h-px bg-gray-200" />
            <ProductVariants
              variants={product?.variants ?? []}
              onVariantChange={handleVariantChange}
            />
            <PurchaseCard
              productId={product._id}
              variantId={selectedVariant._id}
            />
            <DeliveryInfo
              returnInfo={
                isReturnable ? product.returnPolicy : "Not Returnable"
              }
            />
          </div>
        </div>

        {/* Bottom Section: Details & Related */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8 space-y-16">
            <ProductTabs
              description={product.description}
              specification={product.specifications}
            />
            <div className="h-px bg-gray-200" />
            <RelatedProducts />
          </div>

          {/* Optional: Sidebar or empty space for balance, 
               or maybe keep related products full width? 
               Let's keep sidebar empty for "Clean" look or put seller info there.
            */}
          <div className="hidden md:block md:col-span-4">
            {/* Maybe Seller Info Card here? */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Sold by</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
                  ZB
                </div>
                <div>
                  <p className="font-medium text-gray-900">Zynora Basics</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    ● 4.9 Verified Seller
                  </p>
                </div>
              </div>
              <button className="w-full text-sm font-medium text-primary border border-primary/20 rounded-md py-2 hover:bg-primary/5 transition-colors">
                Visit Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

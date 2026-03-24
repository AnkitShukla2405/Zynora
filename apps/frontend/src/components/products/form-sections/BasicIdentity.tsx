"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormValues } from "../schema";
import { Info } from "lucide-react";
import {
  CategoryKey,
  PRODUCT_CATEGORIES,
  SubCategoryKey,
} from "@/types/productCategories";

type SubCategoryDataType = {
  name: string;
  attributes: any[];
  types: string[];
};

export const BasicIdentity = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ProductFormValues>();
  const name = watch("name");
  const selectedCategory = watch("category") as CategoryKey;

  type CurrentSubCategory = typeof selectedCategory extends CategoryKey
    ? SubCategoryKey<typeof selectedCategory>
    : never;
  const selectedSubCategory = watch("subCategory") as string;

const subCategoryData: SubCategoryDataType | null = (() => {
  if (!selectedCategory || !selectedSubCategory) return null;

  const subCategories =
    PRODUCT_CATEGORIES[selectedCategory].subCategories;

  if (!(selectedSubCategory in subCategories)) return null;

  const key = selectedSubCategory as keyof typeof subCategories;
  const data = subCategories[key];

  return data as SubCategoryDataType;
})();

  useEffect(() => {
    if (selectedCategory) {
      setValue("subCategory", "");
      setValue("productType", "");
    }
  }, [selectedCategory, setValue]);

  useEffect(() => {
    if (selectedSubCategory) {
      setValue("productType", "");
    }
  }, [selectedSubCategory, setValue]);

  useEffect(() => {
    if (name) {
      const slug = name
        ? name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : "";

      setValue("slug", slug, { shouldValidate: true });
    }
  }, [name, setValue]);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Identity
          </h2>
          <p className="text-xs text-gray-500">
            Core product details for SEO and URL
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="col-span-2">
          <Label className="mb-2 block">Product Name</Label>
          <Input
            {...register("name")}
            placeholder="e.g. Men's Cotton Classic T-Shirt"
            className={
              errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Brand */}
        <div>
          <Label className="mb-2 block">Brand</Label>
          <Input
            {...register("brand")}
            placeholder="e.g. H&M"
            className={
              errors.brand ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.brand && (
            <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>
          )}
        </div>

        {/* Slug (Read-onlyish preview) */}
        <div>
          <Label className="mb-2 block">URL Slug</Label>
          <div className="relative">
            <Input
              {...register("slug")}
              placeholder="auto-generated-slug"
              className="pl-20 bg-gray-50 text-gray-500"
            />
            <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-medium select-none">
              /product/
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Auto-generated from name</p>
        </div>

        {/* Categories (Native Selects for speed) */}
        <div>
          <Label className="mb-2 block">Category</Label>
          <div className="relative">
            <select
              {...register("category")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
            >
              {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
            {/* Custom arrow could go here */}
          </div>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <Label className="mb-2 block">Sub-Category</Label>
          <select
            {...register("subCategory")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
          >
            <option value="">Select Subcategory</option>

            {selectedCategory &&
              Object.keys(
                PRODUCT_CATEGORIES[selectedCategory].subCategories,
              ).map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
          {errors.subCategory && (
            <p className="text-red-500 text-xs mt-1">
              {errors.subCategory.message}
            </p>
          )}
        </div>

        <div>
          <Label className="mb-2 block">Product Types</Label>
          <select
            {...register("productType")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
          >
            <option value="">Select Product Type</option>
            {subCategoryData?.types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>
          {errors.productType && (
            <p className="text-red-500 text-xs mt-1">
              {errors.productType.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="col-span-2">
          <Label className="mb-2 block">Short Description</Label>
          <textarea
            {...register("description")}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Brief summary of the product (appears near price on PDP)..."
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

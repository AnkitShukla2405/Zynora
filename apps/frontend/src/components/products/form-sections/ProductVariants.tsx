"use client";

import React, { useState, useCallback } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VariantImages } from "./variantImage";
import { ProductFormValues } from "../schema";
import {
  CategoryKey,
  PRODUCT_CATEGORIES,
  SubCategoryKey,
} from "@/types/productCategories";
import {
  Layers,
  Trash2,
  Plus,
  Image as ImageIcon,
  UploadCloud,
  GripVertical,
} from "lucide-react";

type SubCategoryData = {
  name: string;
  attributes: readonly {
    name: string;
    type: string;
    values?: readonly string[];
  }[];
  types: readonly string[];
};

export const ProductVariants = () => {
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

const category = watch("category") as CategoryKey | undefined;
const subCategory = watch("subCategory") as string | undefined;


function getSubCategoryData(
  category: CategoryKey | undefined,
  subCategory: string | undefined
): SubCategoryData | undefined {
  if (!category || !subCategory) return undefined;

  const cat = PRODUCT_CATEGORIES[category];

  if (!(subCategory in cat.subCategories)) return undefined;

  return cat.subCategories[
    subCategory as keyof typeof cat.subCategories
  ] as unknown as SubCategoryData;
}

const subCategoryData = getSubCategoryData(category, subCategory);

const attributes = subCategoryData?.attributes ?? null;

  const [dragActiveStates, setDragActiveStates] = useState<
    Record<number, boolean>
  >({});

  // Process Files: create ObjectURL + update RHF
  const processFiles = useCallback(
    (files: FileList | File[], variantIndex: number) => {
      const currentVariants = getValues("variants");
      const currentImages = currentVariants[variantIndex]?.variantImages || [];

      const newImages = Array.from(files)
        .filter((file): file is File => file instanceof File)
        .map((file) => {
          const clientId = crypto.randomUUID();

          return {
            clientId,
            preview: URL.createObjectURL(file),
            file,
          };
        });

      const updatedImages = [...currentImages, ...newImages];

      setValue(`variants.${variantIndex}.variantImages`, updatedImages, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [getValues, setValue],
  );

  // Drag event handlers
  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates((prev) => ({ ...prev, [index]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates((prev) => ({ ...prev, [index]: false }));
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates((prev) => ({ ...prev, [index]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files, index);
      e.dataTransfer.clearData();
    }
  };

  // Helper to get variant label
  const getVariantLabel = (index: number) => {
    const color = watch(`variants.${index}.colorName` as any);
    const size = watch(`variants.${index}.size` as any);
    if (color && size) return `${color} / ${size}`;
    if (color) return color;
    if (size) return size;
    return `Variant ${index + 1}`;
  };

  // File input change handler
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files, index);
    }
    // Reset input to allow re-uploading same file
    e.target.value = "";
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 scroll-mt-28"
      id="product-variants"
    >
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Product Variants
            </h2>
            <p className="text-xs text-gray-500">
              Manage different options like size, color, and specific images
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            append({
              sku: "",
              stock: 0,
              price: 0,
              attributes: {},
              variantImages: [],
            })
          }
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 relative group"
          >
            {/* Header of the Card */}
            <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3">
              <div className="flex items-center gap-3">
                <div className="cursor-move text-gray-300 hover:text-gray-500">
                  <GripVertical className="w-4 h-4" />
                </div>
                <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs font-semibold text-gray-500">
                  {index + 1}
                </span>
                <span className="font-semibold text-gray-700 text-sm">
                  {getVariantLabel(index)}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Top Row: Attributes */}
            <div className="grid grid-cols-2 gap-5">
              {attributes?.map((attr, attrIndex) => (
                <div key={attr.name}>
                  <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    {attr.name}
                  </Label>

                  {attr.type === "select" ? (
                    <select
                      {...register(`variants.${index}.attributes.${attr.name}`)}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">Select {attr.name}</option>
                      {attr.values?.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      {...register(`variants.${index}.attributes.${attr.name}`)}
                      placeholder={`Enter ${attr.name}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Middle Row: Price, Stock, SKU */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  SKU
                </Label>
                <Input
                  {...register(`variants.${index}.sku`)}
                  placeholder="SKU-123"
                  className="font-mono text-xs uppercase"
                />
                {errors.variants?.[index]?.sku && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.variants[index]?.sku?.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Price Override
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-xs">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    {...register(`variants.${index}.price` as any)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Stock Quantity
                </Label>
                <Input
                  type="number"
                  {...register(`variants.${index}.stock`, {
                    valueAsNumber: true,
                  })}
                  placeholder="0"
                />
                {errors.variants?.[index]?.stock && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.variants[index]?.stock?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Variant Images UI */}
            <div
              className={`
                                border border-dashed rounded-lg p-5 transition-colors duration-200
                                ${
                                  dragActiveStates[index]
                                    ? "bg-indigo-50 border-indigo-400"
                                    : "bg-gray-50/50 border-gray-300"
                                }
                            `}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragOver={(e) => handleDragEnter(e, index)}
              onDragLeave={(e) => handleDragLeave(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Variant Images
                  </Label>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    These images will be shown when this variant is selected
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2 py-1 rounded shadow-sm border ${
                    (watch(`variants.${index}.variantImages`)?.length || 0) > 0
                      ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  {watch(`variants.${index}.variantImages`)?.length || 0}{" "}
                  selected
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {/* Upload Button */}
                <div
                  className={`
                                    aspect-square relative group cursor-pointer bg-white transition-all 
                                    border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-2 text-center
                                    ${
                                      dragActiveStates[index]
                                        ? "border-indigo-400 bg-indigo-50/50"
                                        : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                                    }
                                `}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => handleImageUpload(e, index)}
                  />
                  <UploadCloud
                    className={`w-5 h-5 mb-1.5 transition-colors ${
                      dragActiveStates[index]
                        ? "text-indigo-500"
                        : "text-gray-400 group-hover:text-indigo-500"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      dragActiveStates[index]
                        ? "text-indigo-600"
                        : "text-gray-500 group-hover:text-indigo-600"
                    }`}
                  >
                    Upload
                  </span>
                </div>

                {/* Render uploaded images using watch() for reactive updates */}
                <VariantImages
                  variantIndex={index}
                  control={control}
                  setValue={setValue}
                />
              </div>

              <p className="text-[10px] text-gray-400 mt-3 text-center">
                Drag & drop or click to upload images
              </p>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="w-12 h-12 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-200">
              <Layers className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              No variants defined
            </h3>
            <p className="text-xs text-gray-500 mb-4 mt-1 max-w-xs mx-auto">
              Add variants to manage different stock levels, prices, and images
              for product options.
            </p>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() =>
                append({
                  sku: "",
                  price: 0,
                  attributes: {},
                  stock: 0,
                  variantImages: [],
                })
              }
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Variant
            </Button>
          </div>
        )}
      </div>

      {errors.variants && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-center gap-2 text-red-600">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <p className="text-xs font-medium">
            {errors.variants.root?.message ||
              "Please fix the errors in the variants above."}
          </p>
        </div>
      )}
    </div>
  );
};

"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { ProductFormValues } from "../schema";
import { Search } from "lucide-react";

export const SeoPreview = () => {
    const { watch } = useFormContext<ProductFormValues>();
    const name = watch("name") || "Product Name";
    const desc = watch("description") || "Product description will appear here...";
    const slug = watch("slug") || "product-slug";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                <Search className="w-4 h-4 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Search Preview</h2>
            </div>

            <div className="space-y-1">
                <div className="text-sm text-[#202124] flex items-center gap-2">
                    <span className="bg-gray-200 rounded-full w-4 h-4 block"></span>
                    <span>zynora.com</span>
                    <span className="text-gray-500">› product › {slug}</span>
                </div>
                <h3 className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                    {name} | Buy Online at Best Price on Zynora
                </h3>
                <p className="text-sm text-[#4d5156] line-clamp-2">
                    {desc}
                </p>
            </div>
        </div>
    );
};

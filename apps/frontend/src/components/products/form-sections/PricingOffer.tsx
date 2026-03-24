"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormValues } from "../schema";
import { Tag, TrendingDown } from "lucide-react";

export const PricingOffer = () => {
    const { register, watch, formState: { errors } } = useFormContext<ProductFormValues>();

    const mrp = watch("mrp");
    const sellingPrice = watch("sellingPrice");

    // Calculate discount percentage
    const discount = (mrp && sellingPrice && mrp > 0)
        ? Math.round(((mrp - sellingPrice) / mrp) * 100)
        : 0;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Tag className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Pricing & Offer</h2>
                    <p className="text-xs text-gray-500">Set your price and discounts</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* MRP */}
                <div>
                    <Label className="mb-2 block">Maximum Retail Price (MRP)</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-sm text-gray-500 font-medium">₹</span>
                        <Input
                            type="number"
                            {...register("mrp", { valueAsNumber: true })}
                            placeholder="0.00"
                            className={`pl-7 ${errors.mrp ? "border-red-500" : ""}`}
                        />
                    </div>
                    {errors.mrp && <p className="text-red-500 text-xs mt-1">{errors.mrp.message}</p>}
                </div>

                {/* Selling Price */}
                <div>
                    <Label className="mb-2 block">Selling Price</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-sm text-gray-500 font-medium">₹</span>
                        <Input
                            type="number"
                            {...register("sellingPrice", { valueAsNumber: true })}
                            placeholder="0.00"
                            className={`pl-7 ${errors.sellingPrice ? "border-red-500" : ""}`}
                        />
                    </div>
                    {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice.message}</p>}
                </div>

            </div>

            {/* Discount Preview Card */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600">
                        <TrendingDown className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-green-900">Customer Savings</p>
                        <p className="text-xs text-green-700">Calculated discount displayed on PDP</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{discount > 0 ? `${discount}%` : "0%"}</p>
                    <p className="text-xs text-green-800 font-medium">OFF</p>
                </div>
            </div>

        </div>
    );
};

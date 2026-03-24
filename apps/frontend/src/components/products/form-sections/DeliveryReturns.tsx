"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormValues } from "../schema";
import { Truck, RotateCcw } from "lucide-react";

export const DeliveryReturns = () => {
    const { register, watch } = useFormContext<ProductFormValues>();
    const isReturnable = watch("isReturnable");

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Truck className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Delivery & Returns</h2>
                    <p className="text-xs text-gray-500">Shipping estimates and policies</p>
                </div>
            </div>

            <div className="space-y-6">

                {/* Delivery Time */}
                <div>
                    <Label className="mb-2 block">Delivery Estimation</Label>
                    <Input
                        {...register("deliveryTime")}
                        placeholder="e.g. 3-5 Business Days"
                    />
                </div>

                {/* Return Policy Toggle */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Returnable Product</Label>
                        <p className="text-xs text-gray-500">Allow customers to return this item</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("isReturnable")}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {/* Conditional Policy Text */}
                {isReturnable && (
                    <div className="bg-blue-50 p-3 rounded-md flex gap-3 animate-in fade-in slide-in-from-top-2">
                        <RotateCcw className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <Label className="mb-1 block text-blue-900">Return Policy Summary</Label>
                            <Input
                                {...register("returnPolicy")}
                                placeholder="e.g. 7-Day Replacement Policy"
                                className="bg-white border-blue-200 focus-visible:ring-blue-200"
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormValues } from "../schema";
import { Box, PackageCheck, AlertTriangle } from "lucide-react";

export const InventoryAvailability = () => {
    const { register, watch } = useFormContext<ProductFormValues>();
    const variants = watch("variants") || [];

    // Derived total stock
    const totalStock = variants.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
    const stockStatus = totalStock > 0 ? "In Stock" : "Out of Stock";
    const stockColor = totalStock > 0 ? "text-green-600" : "text-red-600";
    const stockBg = totalStock > 0 ? "bg-green-50" : "bg-red-50";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-28">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <Box className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
                    <p className="text-xs text-gray-500">Stock summary from variants</p>
                </div>
            </div>

            <div className="space-y-6">

                {/* Total Stock Card */}
                <div className={`rounded-lg p-4 flex items-center justify-between border ${stockBg} border-opacity-50`}>
                    <div className="flex items-center gap-3">
                        <PackageCheck className={`w-5 h-5 ${stockColor}`} />
                        <div>
                            <h3 className={`text-sm font-semibold ${stockColor}`}>{stockStatus}</h3>
                            <p className="text-xs text-gray-500">Combined Total</p>
                        </div>
                    </div>
                    <div className={`text-2xl font-bold ${stockColor}`}>
                        {totalStock}
                    </div>
                </div>

                {/* Low Stock Threshold */}
                <div>
                    <Label className="mb-2 block">Low Stock Warning</Label>
                    <div className="relative">
                        <Input
                            type="number"
                            {...register("lowStockThreshold", { valueAsNumber: true })}
                            placeholder="10"
                            className="pl-9"
                        />
                        <AlertTriangle className="absolute left-3 top-2.5 w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Get validation warning if stock drops below this.</p>
                </div>

            </div>
        </div>
    );
};

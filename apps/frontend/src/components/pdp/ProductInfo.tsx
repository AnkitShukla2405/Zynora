"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
// Ensure you have a badge component, or use a simple span
import { Badge } from "@/components/ui/badge"

type ProductInfoProps = {
  brand: string;
  name: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
};


export function ProductInfo({brand, name, mrp, sellingPrice, discountPercentage}: ProductInfoProps) {
    return (
        <div className="space-y-4">
            {/* Brand & Rating */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {brand}
                </span>
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-gray-900">4.8</span>
                    <span className="text-sm text-gray-500">(128 reviews)</span>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-bold text-gray-900">{sellingPrice}</span>
                <span className="text-lg text-gray-400 line-through">{mrp}</span>
                <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-50">
                    {discountPercentage}
                </Badge>
            </div>

            <div className="text-sm text-gray-500">
                Inclusive of all taxes
            </div>
        </div>
    )
}

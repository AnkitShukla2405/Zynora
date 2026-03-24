"use client"

import * as React from "react"
import { Star } from "lucide-react"

export function RelatedProducts() {
    const products = [
        {
            id: 1,
            name: "Slim Fit Chinos",
            price: "$49.00",
            image: "/placeholder-chinos.jpg", // Placeholder
            rating: 4.5,
        },
        {
            id: 2,
            name: "Oxford Cotton Shirt",
            price: "$59.00",
            image: "/placeholder-shirt.jpg",
            rating: 4.7,
        },
        {
            id: 3,
            name: "Leather Loafers",
            price: "$120.00",
            image: "/placeholder-loafers.jpg",
            rating: 4.8,
        },
        {
            id: 4,
            name: "Canvas Belt",
            price: "$25.00",
            image: "/placeholder-belt.jpg",
            rating: 4.2,
        },
    ]

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="group relative space-y-3 rounded-lg border border-gray-100 bg-white p-3 hover:shadow-md transition-shadow">
                        <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100 group-hover:opacity-90 transition-opacity">
                            {/* Image Placeholder */}
                            <div className="h-full w-full flex items-center justify-center text-gray-300 text-xs">
                                Product Img
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">{product.price}</span>
                                <div className="flex items-center text-xs text-amber-400 gap-0.5">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span className="text-gray-500">{product.rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

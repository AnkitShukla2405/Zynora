import React from 'react';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';

interface CartItemProps {
    id: string;
    title: string;
    brand: string;
    image: string;
    price: number;
    originalPrice: number;
    discount: number;
    quantity: number;
    maxStock: number;
    variants: { name: string; value: string }[];
    sellerName: string;
    onUpdateQuantity: (delta: number) => void;
    onRemove: (id: string) => void;
    onSaveForLater: (id: string) => void;
    productId : string,
    variantId : string,
}

const CartItem: React.FC<CartItemProps> = ({
    id,
    title,
    brand,
    image,
    price,
    originalPrice,
    discount,
    quantity,
    maxStock,
    variants,
    sellerName,
    onUpdateQuantity,
    onRemove,
    onSaveForLater,
    productId,
    variantId
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors p-4 rounded-xl">
            {/* Product Image */}
            <div className="shrink-0 relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-gray-100 bg-white">
                    <img
                        src={`${process.env.NEXT_PUBLIC_CDN_URL}/${image}`}
                        alt={title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">{brand}</p>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
                                {title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Sold by <span className="text-red-600 font-medium hover:underline cursor-pointer">{sellerName}</span>
                            </p>
                        </div>
                        {/* Price Info (Desktop right aligned, but we'll keep it flexible) */}
                        <div className="text-right hidden sm:block">
                            <div className="font-bold text-lg text-gray-900">₹{price.toLocaleString()}</div>
                            <div className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString()}</div>
                            <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                {discount}% OFF
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {variants?.map((v, idx) => (
                            <div key={idx} className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                                <span className="font-medium mr-1 text-gray-500">{v.name}:</span>
                                <span className="text-gray-900">{v.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions & Quantity */}
                <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                    <div className="flex items-center gap-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm h-9">
                            <button
                                onClick={() => onUpdateQuantity(-1)}
                                disabled={quantity <= 1}
                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent rounded-l-lg transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                            <button
                                onClick={() => onUpdateQuantity(+1)}
                                disabled={quantity >= maxStock}
                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent rounded-r-lg transition-colors"
                                title={quantity >= maxStock ? `Only ${maxStock} items available` : 'Add more'}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Stock Message */}
                        {maxStock < 5 && (
                            <span className="text-xs font-medium text-orange-600 animate-pulse">
                                Only {maxStock} left!
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => onRemove(id)}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove</span>
                        </button>
                        <button
                            onClick={() => onSaveForLater(id)}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                            <Heart className="w-4 h-4" />
                            <span className="hidden sm:inline">Save for Later</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Price Overlay (if needed, but structure handles it) */}
            <div className="sm:hidden flex justify-between items-center w-full mt-2 pt-3 border-t border-gray-100">
                <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {discount}% OFF
                </div>
                <div className="text-right flex items-baseline gap-2">
                    <span className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                    <span className="font-bold text-lg text-gray-900">₹{price.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default CartItem;

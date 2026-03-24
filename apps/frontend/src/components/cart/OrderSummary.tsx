import React, { useState } from 'react';
import { ArrowRight, Tag, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface OrderSummaryProps {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    savedAmount: number;
    onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    subtotal,
    discount,
    shipping,
    tax,
    total,
    savedAmount,
    onCheckout,
}) => {
    const [couponOpen, setCouponOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            {/* Pricing Breakdown */}
            <div className="space-y-3">
                <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 text-sm font-medium">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                    <span>Tax (GST)</span>
                    <span>₹{tax.toLocaleString()}</span>
                </div>

                <div className="border-t border-dashed border-gray-200 my-4 pt-4">
                    <div className="flex justify-between items-end">
                        <span className="text-base font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">
                        (Includes all taxes)
                    </div>
                </div>
            </div>

            {/* Savings Badge */}
            <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-2 text-green-700 text-sm font-medium">
                <Tag className="w-4 h-4 fill-green-600" />
                You will save ₹{savedAmount.toLocaleString()} on this order
            </div>

            {/* Coupons Accordion */}
            <div className="mt-6 border-t border-gray-100 pt-4">
                <button
                    onClick={() => setCouponOpen(!couponOpen)}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Apply Coupon
                    </span>
                    {couponOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {couponOpen && (
                    <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter code"
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:red-500/20 focus:bored-500 transition-all uppercase"
                            />
                            <button className="text-sm font-medium text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                                Apply
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                            Available offers: <span className="text-red-600 cursor-pointer hover:underline">ZYNORA20</span>, <span className="text-red-600 cursor-pointer hover:underline">FREESHIP</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Secure Payments
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-red-600" />
                    Genuine Products
                </div>
            </div>

            {/* Main Actions */}
            <div className="mt-6 space-y-3">
                <button
                    onClick={onCheckout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-red-200 hover:shadow-red-300 transition-all flex items-center justify-center gap-2 group"
                >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
                    Continue Shopping
                </button>
            </div>

        </div>
    );
};

export default OrderSummary;

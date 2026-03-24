"use client";

import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import DeliveryInfo from '@/components/cart/DeliveryInfo';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { v4 as uuidv4 } from "uuid";

type CartItemType = {
  productId: string;
  variantId: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
  maxStock: number;
  sellerName: string;
  variants: {
    name: string;
    value: string;
  }[];
};

type GetCartDataResponse = {
  getCartData: {
    result: CartItemType[];
  };
};

type CheckoutResponse = {
  proceedToCheckout: {
    success: boolean;
    message: string;
    code?: string;
    redirectTo: string;
  };
};

const GET_CART_DATA = gql`
query GetCartData{
    getCartData{
        result{
        productId
        variantId
        title
        brand
        image
        price
        originalPrice
        discount
        quantity
        maxStock
        sellerName
        variants{
            name
            value
        }}
    }
}
`

const CHANGE_CART_QUANTITY = gql`
mutation ChangeCartQuantity($productId: ID!, $variantId: ID!, $qty: Int!) {
  changeCartQuantity(productId: $productId, variantId: $variantId, qty: $qty) {
        success
        message
    }
}
`

const CHECKOUT = gql`
mutation Checkout {
    proceedToCheckout {
        success
        message
        code
        redirectTo
    }
}
`

export default function CartPage() {
    const {data, loading, error, refetch} = useQuery<GetCartDataResponse>(GET_CART_DATA, {
        context: {skipAuth: true},
        fetchPolicy: "cache-and-network"
    })
    const [changeCartQuantity] = useMutation(CHANGE_CART_QUANTITY, {
        refetchQueries: [{ query: GET_CART_DATA }],
        context: {skipAuth: true}
    })
    const [checkout] = useMutation<CheckoutResponse>(CHECKOUT, {
        context: {skipAuth: true}
    })

    const items = data?.getCartData?.result || [];
   
    const router = useRouter()

   


      if (loading) return <Loader />;


    const getItemKey = (item: CartItemType) => `${item.productId}-${item.variantId}`;



const handleQuantityUpdate = async (productId: string, variantId: string, delta: number) => {
    try {
        await changeCartQuantity({
            variables: {
                productId,
                variantId,
                qty: delta
            }
        })

        await refetch()
    } catch (error) {
        console.error("Failed to update cart", error);
    }
}

const handleRemove = async (
  productId: string,
  variantId: string,
  quantity: number
) => {
  if (quantity <= 0) return;

  await handleQuantityUpdate(productId, variantId, -quantity);
};
    const handleSaveForLater = (item: CartItemType) => {
        handleRemove(item.productId, item.variantId, item.quantity);
    };

    const handleCheckout = async () => {
         console.log("CHECKOUT CLICKED")
        let idemKey = sessionStorage.getItem("checkout_idem_key");

  if (!idemKey) {
    idemKey = uuidv4();
    sessionStorage.setItem("checkout_idem_key", idemKey);
  }
        const result = await checkout({
            context: {
                
                headers: {
                    "Idempotency-Key": idemKey,
                }
            }
        })

        console.log("GRAPHQL RESULT:", result);

        const res = result?.data?.proceedToCheckout

        if (!res) {
  console.error("Checkout response missing");
  return;
}

        if(res?.success) {
            console.log(res.message)
            router.push(res.redirectTo)
        }else {
            if(!res.success) {

                console.log(res.message)
            router.push("/checkout")
            }
        }
        

        
    };

    // Calculations
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const originalTotal = items.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
    const discount = Math.max(0, originalTotal - subtotal);
    const shipping = subtotal > 5000 ? 0 : 100; // Free shipping over 5000
    const tax = Math.round(subtotal * 0.18); // 18% GST estimate
    const total = subtotal + shipping + tax;
    const totalSaved = discount + (shipping === 0 && subtotal > 0 ? 100 : 0); // Include shipping savings if applicable

    const cartEmpty = items.length === 0;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 sm:pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/search" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Your Cart <span className="text-gray-400 font-normal ml-2 text-lg">({items.length} items)</span></h1>
                </div>

                {cartEmpty ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your cart yet. Explore our products today!</p>
                        <Link
                            href="/products"
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-red-200"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Items & Delivery */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Delivery Info */}
                            <DeliveryInfo />

                            {/* Cart Items List */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="divide-y divide-gray-100">
                                    {items.map(item => (
                                        <CartItem
                                            key={getItemKey(item)}
                                            id={getItemKey(item)}
                                            {...item}
                                            onUpdateQuantity={(qty: number) => handleQuantityUpdate(item.productId, item.variantId, qty)}
                                            onRemove={() => handleRemove(item.productId, item.variantId, item.quantity)}
                                            onSaveForLater={() => handleSaveForLater(item)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Note/Policy (Optional) */}
                            <div className="bg-red-50/50 rounded-xl p-4 border border-red-100 text-sm text-red-700">
                                <span className="font-semibold">Note:</span> Items in your cart are not reserved until you complete your purchase.
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-4 lg:block hidden">
                            <OrderSummary
                                subtotal={subtotal}
                                discount={discount}
                                shipping={shipping}
                                tax={tax}
                                total={total}
                                savedAmount={totalSaved}
                                onCheckout={handleCheckout}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Checkout Bar */}
            {!cartEmpty && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 font-medium uppercase">Total Payable</div>
                            <div className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</div>
                            <div className="text-xs text-green-600 font-medium">You save ₹{totalSaved.toLocaleString()}</div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="bg-red-600 active:bg-red-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-red-200 transition-colors"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

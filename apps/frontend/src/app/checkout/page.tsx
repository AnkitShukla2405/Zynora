"use client";

import React from "react";
import { ChevronRight, Lock, ShieldCheck } from "lucide-react";
import { AddressSection } from "@/components/checkout/AddressSection";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";
import Loader from "@/components/Loader";
import { v4 as uuidv4 } from "uuid";

enum PaymentMethod {
  UPI = "UPI",
  CREDIT_DEBITCARD = "CREDIT_DEBITCARD",
  NETBANKING = "NETBANKING",
  COD = "COD",
}

type Variant = {
  name: string;
  value: string;
};

type CartItem = {
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
  variants: Variant[];
};

type GetCheckoutCartDataResponse = {
  getCheckoutCartData: CartItem[];
};

type ProceedToPaymentResponse = {
  proceedToPayment: {
    orderId: string;
    checkoutUrl: string;
  };
};

const PROCEED_TO_PAYMENT = gql`
  mutation ProceedToPayment($selectedAddressId: ID!) {
    proceedToPayment(selectedAddressId: $selectedAddressId) {
      orderId
      checkoutUrl
    }
  }
`;

const GET_CHECKOUT_CART_DATA = gql`
query GetCheckoutCartData{
    getCheckoutCartData{
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
        }
    }
}
`

export default function CheckoutPage() {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );



  const {data, loading, error, refetch} = useQuery<GetCheckoutCartDataResponse>(GET_CHECKOUT_CART_DATA, {
    context: {skipAuth: true},
    fetchPolicy: "cache-and-network"
  })


  const cartItems = data?.getCheckoutCartData ?? [];

    const { subtotal, discount, shipping, tax, total } = useMemo(() => {

  const subtotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  const originalTotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.originalPrice * item.quantity,
    0
  );

  const discount = Math.max(0, originalTotal - subtotal);

  const shipping = subtotal > 5000 ? 0 : 100;

  const tax = Math.round(subtotal * 0.18);

  const total = subtotal + shipping + tax;

  return { subtotal, discount, shipping, tax, total };

}, [cartItems]);

  const [proceedToPayment] = useMutation<ProceedToPaymentResponse>(PROCEED_TO_PAYMENT, {
    context: {skipAuth: true},
  });

    if (loading) return <Loader />;

  const onSelectAddressId = (data: string) => {
    setSelectedAddressId(data);
  };

  console.log(selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;

    const idemKey = uuidv4();

    try {
      const { data } = await proceedToPayment({
        variables: { selectedAddressId },
        context: {
          headers: {
            "Payment-Idempotency-Key": idemKey
          }
        }
      },
    );

      const checkoutUrl = data?.proceedToPayment?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("Checkout URL missing");
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(error);
      alert("Unable to proceed to payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 lg:pb-12">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div className="hidden sm:flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-full font-medium">
            <ShieldCheck className="w-4 h-4" />
            100% Secure Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Address Section */}
            <AddressSection onSelectAddressId={onSelectAddressId} />
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <OrderSummary handlePlaceOrder={handlePlaceOrder} data={cartItems} discount={discount} total={total} tax={tax} />

            {/* Trust Badges - Desktop Only */}
            <div className="mt-6 hidden lg:grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Authentic Products
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Secure Payments
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Easy Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500">Total payable</p>
            <p className="text-xl font-bold text-gray-900">₹3,798</p>
          </div>
          <Button className="flex-1 h-12 text-base font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90" onClick={handlePlaceOrder} disabled={!selectedAddressId}>
            Place Order
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { ShoppingBag, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Variant = {
  value: string;
};

type CartItem = {
  variantId: string;
  image: string;
  title: string;
  price: number;
  quantity: number;
  variants: Variant[];
};

type OrderSummaryProps = {
  handlePlaceOrder: () => void;
  data: CartItem[];
  discount: number;
  total: number;
  tax: number;
};

export const OrderSummary = ({ handlePlaceOrder, data, discount, total, tax }: OrderSummaryProps) => {
  const subtotal = data?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Order Summary{" "}
          <span className="text-gray-400 font-normal text-sm">
            {data?.length || 0}
          </span>
        </h3>
      </div>

      {/* Product List */}
      <div className="p-6 space-y-6">
        {data?.map((p) => (
          <div key={p.variantId} className="flex gap-4">
            {/* Placeholder for Product Image */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${p.image}`}
                alt={p.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <h4 className="line-clamp-2">{p.title}</h4>
                <p className="ml-4 shrink-0">₹{p.price}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {p.variants.map((v) => v.value).join(", ")}
              </p>

              <p className="mt-1 text-sm text-gray-500">Qty {p.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Bill Details */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            ₹{subtotal?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium text-green-600">-₹{discount}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Tax (GST)</span>
          <span>₹{tax.toLocaleString()}</span>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-900">
            Grand Total
          </span>
          <span className="text-xl font-bold text-gray-900">₹{total}</span>
        </div>

        <div className="pt-4">
          <Button
            onClick={handlePlaceOrder}
            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
          >
            Continue to Payment
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            Secure Encrypted Transaction
          </p>
        </div>
      </div>
    </div>
  );
};

"use client";

import * as React from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery} from "@apollo/client/react";
import toast from "react-hot-toast";
import { GET_CART_DATA } from "../Navbar";
import { useRouter } from "next/navigation";

type CreateCartResponse = {
  createCart: {
    success: boolean;
  };
};

type BuyNowResponse = {
  buyNow: {
    success: boolean,
    message: string
  }
}

type BuyNowVariable = {
  input: {
  productId: string;
  variantId: string;
  quantity: number;
}
}

const BUY_NOW = gql`
mutation BuyNow($input: BuyNowInput!) {
  buyNow(input: $input) {
    success
    message
  }
}
`

type CreateCartVariables = {
  productId: string;
  variantId: string;
  qty: number;
};

const CREATE_CART = gql`
  mutation CreateCart($productId: ID!, $variantId: ID!, $qty: Int!) {
    createCart(productId: $productId, variantId: $variantId, qty: $qty) {
      success
    }
  }
`;

export function PurchaseCard({
  productId,
  variantId,
}: {
  productId: string;
  variantId: string;
}) {
  const router = useRouter()
  const [createCart] = useMutation<CreateCartResponse, CreateCartVariables>(CREATE_CART, {
    context: {skipAuth: true},
    refetchQueries: [{ query: GET_CART_DATA }],
  });

  const [handleBuyNow, {loading: buyNowLoading}] = useMutation<BuyNowResponse, BuyNowVariable>(BUY_NOW)
  const handleAddToCartClick = async () => {
    const qty = 1
    const result = await createCart({
      variables: {
        productId,
        variantId,
        qty
      }
    })

    if(result?.data?.createCart?.success) {
      toast.success("Product added to cart");
    }
  };

  const handleBuyNowClick = async () => {
  try {
    const result = await handleBuyNow({
      variables: {
        input: {
          productId,
          variantId,
          quantity: 1,
        },
      },
    });

    if (result?.data?.buyNow?.success) {
      toast.success("Redirecting to checkout...");
      router.push("/checkout");
    } else {
      toast.error(result?.data?.buyNow?.message || "Something went wrong");
    }
  } catch (error) {
    toast.error("Failed to process Buy Now");
    console.error(error);
  }
};
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCartClick}
          variant="outline"
          className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition-all active:scale-[0.98]"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>

        <Button
          variant="outline"
          className="h-12 w-12 px-0 border-gray-200 hover:bg-gray-50 hover:text-red-600 transition-colors"
        >
          <Heart className="h-5 w-5" />
          <span className="sr-only">Add to Wishlist</span>
        </Button>
      </div>

      <Button
      onClick={handleBuyNowClick}
      disabled={buyNowLoading}
        variant="outline"
        className="w-full h-11 border-primary/20 text-primary hover:bg-primary/5 font-medium"
      >
        Buy Now
      </Button>
    </div>
  );
}

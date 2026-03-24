"use client";

import React from "react";
import { Store, Star } from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

type GetSellerNameResponse = {
  getSellerNameForUi: {
    name: string;
    image: string | null;
  };
};

const GET_SELLER_NAME = gql`
  query GetSellerNameForUi {
    getSellerNameForUi {
      name
      image
    }
  }
`;

export const SellerInfo = () => {
  const { data, loading, error } = useQuery<GetSellerNameResponse>(GET_SELLER_NAME);

  const seller = {
    name: data?.getSellerNameForUi?.name || "Seller",
    rating: 4.8,
  };

  const imageUrl = data?.getSellerNameForUi?.image
    ? `${process.env.NEXT_PUBLIC_CDN_URL}/${encodeURI(
        data.getSellerNameForUi.image,
      )}`
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 opacity-80 hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
        <Store className="w-4 h-4 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Seller Info</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md border border-gray-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="seller logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              {seller.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{seller.name}</h3>
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current opacity-50" />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {seller.rating} / 5
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        This is how your seller card appears on the product page.
      </p>
    </div>
  );
};

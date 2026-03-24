"use client";

import { usePathname } from "next/navigation";
import { Bell, User } from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

type GetSellerNameForUiResponse = {
  getSellerNameForUi: {
    name: string;
    image: string | null;
  };
};

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/orders": "Orders",
  "/inventory": "Inventory",
  "/store-profile": "Store Profile",
  "/settings": "Settings",
};

const GET_SELLER_NAME = gql`
  query GetSellerNameForUi {
    getSellerNameForUi {
      name
      image
    }
  }
`;

export function Topbar() {
  const { data, loading, error } = useQuery<GetSellerNameForUiResponse>(GET_SELLER_NAME);

  const sellerName = loading
    ? "Loading..."
    : error
      ? "Error"
      : data?.getSellerNameForUi?.name || "Seller";

      const imageUrl = data?.getSellerNameForUi?.image;
  const pathname = usePathname();
  const title = routeTitles[pathname] || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left: Page Title */}
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {sellerName}
            </p>
            <p className="text-xs text-gray-500">Seller</p>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/20">
  {imageUrl ? (
    <img
      src={`${process.env.NEXT_PUBLIC_CDN_URL}/${imageUrl}`}
      alt="store logo"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="bg-primary/10 text-primary flex items-center justify-center w-full h-full">
      <User className="w-5 h-5" />
    </div>
  )}
</div>
        </div>
      </div>
    </header>
  );
}

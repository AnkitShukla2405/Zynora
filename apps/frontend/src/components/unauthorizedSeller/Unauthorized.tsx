"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";

type UnauthorizedSellerProps = {
    redirectLink: string
}

export default function UnauthorizedSeller({redirectLink}: UnauthorizedSellerProps) {
  const router = useRouter();

  // 🔁 Auto redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(redirectLink);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black px-4">
      <div className="text-center max-w-md w-full">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-full bg-red-600/20 border border-red-500 shadow-lg shadow-red-500/20">
            <ShieldX className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-red-500 mb-2">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-4">
          You are not authorized to access the seller dashboard.
        </p>

        <p className="text-gray-500 text-sm mb-6">
          Redirecting you to seller registration...
        </p>

        {/* CTA */}
        <button
          onClick={() => router.replace("/seller/register")}
          className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-md shadow-red-500/30 transition-all duration-300"
        >
          Become a Seller
        </button>
      </div>
    </div>
  );
}
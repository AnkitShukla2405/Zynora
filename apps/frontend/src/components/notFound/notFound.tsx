import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";


export default function ProductNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black px-4">
      <div className="text-center max-w-md w-full">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-full bg-red-600/20 border border-red-500 shadow-lg shadow-red-500/20">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-red-500 mb-2">
          Product Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-6">
          The product you are looking for doesn’t exist or may have been removed.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-md shadow-red-500/30 transition-all duration-300"
          >
            Go Home
          </button>

          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            Browse Products
          </button>
        </div>
      </div>
    </div>
  );
}
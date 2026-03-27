"use client";



import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw, ShoppingCart } from 'lucide-react';

/**
 * PaymentCancelContent Component
 * Wrapped in Suspense to handle useSearchParams() in a client component 
 * during static site generation (SSG) / build time.
 */
const PaymentCancelContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');


  return (
    <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
      {/* Cancel/Warning Icon */}
      <div className="flex justify-center mb-6">
        <div className="bg-orange-50 p-4 rounded-full">
          <XCircle className="w-16 h-16 text-orange-500" strokeWidth={1.5} />
        </div>
      </div>

      {/* Main Content */}
      <h1 className="text-3xl font-bold text-slate-900 mb-3">
        Payment Cancelled
      </h1>
      <p className="text-slate-600 mb-8 leading-relaxed">
        Your payment was not completed. No worries—no amount has been charged to your account.
      </p>

      {/* Optional Order ID Reference */}
      {orderId && (
        <div className="mb-8 px-4 py-2 bg-slate-50 rounded-lg inline-block border border-slate-100">
          <p className="text-xs font-medium text-slate-500 italic">
            Reference ID: <span className="font-mono text-slate-700">{orderId}</span>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Link
          href="/checkout"
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Payment Again
        </Link>
        
        <Link
          href="/cart"
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Return to Cart
        </Link>
      </div>

      {/* Secondary Navigation */}
      <div className="mt-8">
        <Link 
          href="/" 
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to home
        </Link>
      </div>
    </div>
  );
};

/**
 * Main Page Component
 * Route: app/payment/cancel/page.tsx
 */
export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
          <p className="font-medium">Loading details...</p>
        </div>
      }>
        <PaymentCancelContent />
      </Suspense>
    </main>
  );
}
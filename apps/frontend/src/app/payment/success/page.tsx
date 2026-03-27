"use client"

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

/**
 * PaymentSuccessContent Component
 * Separated to handle useSearchParams() within a Suspense boundary,
 * ensuring the page remains compatible with static rendering.
 */
const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('payment_intent');

  return (
    <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="bg-emerald-50 p-4 rounded-full">
          <CheckCircle2 className="w-16 h-16 text-emerald-500" strokeWidth={1.5} />
        </div>
      </div>

      {/* Main Content */}
      <h1 className="text-3xl font-bold text-slate-900 mb-3">
        Payment Successful 🎉
      </h1>
      <p className="text-slate-600 mb-8 leading-relaxed">
        Thank you for your order. Your payment was successful and your order is being processed.
      </p>

      {/* Order Reference Card */}
      {orderId && (
        <div className="bg-slate-50 rounded-lg p-4 mb-8 border border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Order Reference
          </span>
          <code className="text-sm font-mono text-slate-700 break-all">
            {orderId}
          </code>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Link
          href="/orders"
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Go to Orders
          <ArrowRight className="w-4 h-4" />
        </Link>
        
        <Link
          href="/"
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      {/* Security Disclaimer (Internal Note) */}
      <p className="mt-8 text-[10px] text-slate-400 italic">
        This page confirms the UI state only. Order fulfillment is handled via secure webhooks.
      </p>
    </div>
  );
};

/**
 * Main Page Component
 */
export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="animate-pulse text-slate-400 font-medium">
          Loading confirmation...
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}
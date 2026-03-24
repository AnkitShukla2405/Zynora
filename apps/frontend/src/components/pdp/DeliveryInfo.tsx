import * as React from "react"
import { Truck, RotateCcw, ShieldCheck, CreditCard } from "lucide-react"

type DeliveryInfoProps = {
  returnInfo: string
}

export function DeliveryInfo({returnInfo}: DeliveryInfoProps) {
    return (
        <div className="space-y-4 rounded-lg bg-gray-50 p-4 border border-gray-100/50">
            {/* Delivery Estimate */}
            <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                    <p className="text-xs text-gray-500">
                        Enter your postal code for Delivery Availability
                    </p>
                </div>
            </div>

            <div className="h-px bg-gray-200/60" />

            {/* Trust Badges Row */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-600">{returnInfo}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-600">1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
            </div>
        </div>
    )
}

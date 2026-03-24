import React, { useState } from 'react';
import { Truck, CreditCard, Wallet, Landmark, Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

enum PaymentMethod {
    UPI = "UPI",
    CREDIT_DEBITCARD = "CREDIT_DEBITCARD",
    NETBANKING = "NETBANKING",
    COD = "COD"
}

type Props = {
    paymentMethod: PaymentMethod | null,
    onSelectPaymentMethod: (method: PaymentMethod) => void
}


export const PaymentSection = ({onSelectPaymentMethod, paymentMethod}: Props) => {
    const [deliveryOption, setDeliveryOption] = useState('standard');

    return (
        <div className="space-y-8 mt-8">
            {/* Delivery Options */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Delivery Options</h2>
                <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                    <Label
                        htmlFor="delivery-standard"
                        className={cn(
                            "flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-all hover:bg-gray-50",
                            deliveryOption === 'standard' ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-200"
                        )}
                    >
                        <div className="flex items-start gap-4">
                            <RadioGroupItem value="standard" id="delivery-standard" className="mt-1" />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">Standard Delivery</span>
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Free</span>
                                </div>
                                <p className="text-sm text-gray-500">Get it by <span className="font-medium text-gray-900">Wed, 24 Jan</span></p>
                            </div>
                        </div>
                        <Truck className="h-5 w-5 text-gray-400" />
                    </Label>
                </RadioGroup>
            </div>

            <Separator />

            {/* Payment Methods */}53
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                        <Lock className="w-3 h-3" />
                        100% Secure
                    </div>
                </div>

                <RadioGroup value={paymentMethod ?? ""} onValueChange={(value) => onSelectPaymentMethod(value as PaymentMethod)} className="grid grid-cols-1 gap-3">
                    {/* UPI */}
                    <Label
                        htmlFor="pm-upi"
                        className={cn(
                            "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:bg-gray-50",
                            paymentMethod === PaymentMethod.UPI ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-200"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <RadioGroupItem value={PaymentMethod.UPI} id="pm-upi" />
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white">
                                    <Wallet className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <span className="block font-semibold text-gray-900">UPI</span>
                                    <span className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</span>
                                </div>
                            </div>
                        </div>
                    </Label>

                    {/* Cards */}
                    <Label
                        htmlFor="pm-card"
                        className={cn(
                            "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:bg-gray-50",
                            paymentMethod === PaymentMethod.CREDIT_DEBITCARD ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-200"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <RadioGroupItem value={PaymentMethod.CREDIT_DEBITCARD} id="pm-card" />
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white">
                                    <CreditCard className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <span className="block font-semibold text-gray-900">Credit / Debit Card</span>
                                    <span className="text-xs text-gray-500">Visa, Mastercard, Rupay</span>
                                </div>
                            </div>
                        </div>
                    </Label>

                    {/* Net Banking */}
                    <Label
                        htmlFor="pm-netbanking"
                        className={cn(
                            "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:bg-gray-50",
                            paymentMethod === PaymentMethod.NETBANKING ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-200"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <RadioGroupItem value={PaymentMethod.NETBANKING} id="pm-netbanking" />
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white">
                                    <Landmark className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <span className="block font-semibold text-gray-900">Net Banking</span>
                                    <span className="text-xs text-gray-500">All Indian banks supported</span>
                                </div>
                            </div>
                        </div>
                    </Label>

                    {/* COD */}
                    <Label
                        htmlFor="pm-cod"
                        className={cn(
                            "flex cursor-not-allowed items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 opacity-70",
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <RadioGroupItem value={PaymentMethod.COD} id="pm-cod" disabled />
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white">
                                    <span className="text-xs font-bold text-gray-600">COD</span>
                                </div>
                                <div>
                                    <span className="block font-semibold text-gray-500">Cash on Delivery</span>
                                    <span className="text-xs text-red-500">Not available for this order</span>
                                </div>
                            </div>
                        </div>
                    </Label>
                </RadioGroup>
            </div>
        </div>
    );
};

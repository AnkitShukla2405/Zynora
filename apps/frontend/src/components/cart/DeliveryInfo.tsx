import React, { useState } from 'react';
import { MapPin, Truck, RefreshCw, CheckCircle2, Search } from 'lucide-react';

const DeliveryInfo: React.FC = () => {
    const [pincode, setPincode] = useState('');
    const [checked, setChecked] = useState(false);

    const handleCheck = () => {
        if (pincode.length === 6) {
            setChecked(true);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                Delivery Information
            </h3>

            {/* Pincode Checker */}
            <div className="flex gap-3 mb-4 max-w-md">
                <div className="relative flex-1">
                    <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter Pincode"
                        value={pincode}
                        onChange={(e) => {
                            setPincode(e.target.value.replace(/\D/g, ''));
                            setChecked(false);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                    />
                    {checked && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    )}
                </div>
                <button
                    onClick={handleCheck}
                    className="text-sm font-medium red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    disabled={pincode.length !== 6}
                >
                    Check
                </button>
            </div>

            {/* Delivery Status */}
            {checked ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4 animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Delivery by <span className="font-bold">Mon, 24 Jan</span> to {pincode}
                    </p>
                    <p className="text-xs text-green-600 mt-1 pl-6">
                        Cash on Delivery Available
                    </p>
                </div>
            ) : (
                <p className="text-xs text-gray-500 mb-4">
                    Enter your pincode to check delivery time and availability.
                </p>
            )}

            {/* Policies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">14 Days Return</p>
                        <p className="text-xs text-gray-500">Easy returns & exchanges</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <ShieldCheckIcon />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">100% Buyer Protection</p>
                        <p className="text-xs text-gray-500">Secure purchase guarantee</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default DeliveryInfo;

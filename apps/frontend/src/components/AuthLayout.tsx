import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
            </div>

            <div className="w-full max-w-[480px] z-10">
                {/* Brand Header */}
                <div className="mb-8 text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                        <ShieldCheck size={24} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
                    <p className="text-slate-500">{subtitle}</p>
                </div>

                {/* Card */}
                <div className="glass-panel p-8 rounded-3xl shadow-xl border border-white/50">
                    {children}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-slate-400">
                    <p>Protected by enterprise-grade security</p>
                </div>
            </div>
        </div>
    );
}

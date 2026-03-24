"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    ClipboardList,
    Store,
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/seller", icon: LayoutDashboard },
    { label: "Products", href: "/seller/products", icon: Package },
    { label: "Orders", href: "/seller/orders", icon: ShoppingCart },
    { label: "Inventory", href: "/seller/inventory", icon: ClipboardList },
    { label: "Store Profile", href: "/seller/store-profile", icon: Store },
    { label: "Settings", href: "/seller/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-border flex flex-col">
            {/* Brand Logo */}
            <div className="h-16 flex items-center px-6 border-b border-border">
                <div className="flex items-center gap-2">
                    {/* Simple Logo Placeholder */}
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-xl">
                        Z
                    </div>
                    <span className="text-xl font-bold text-primary tracking-tight">Zynora</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Info could go here if needed, keeping it clean for now */}
            <div className="p-4 border-t border-border">
                <div className="text-xs text-gray-400 text-center">
                    © 2025 Zynora
                </div>
            </div>
        </aside>
    );
}

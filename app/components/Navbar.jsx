"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function Navbar() {
    const pathname = usePathname();
    const { itemCount } = useCart();
    const [open, setOpen] = useState(false);

    const links = [
        { href: "/products", label: "Products" },
        { href: "/about", label: "About" },
        { href: "/checkout", label: "Checkout" },
    ];

    return (
        <header className="w-full border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-10">
                <div className="flex items-center gap-4">
                    <Link href="/products" className="group flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-900 shadow-md" />
                        <span className="text-lg font-semibold text-slate-900 transition group-hover:opacity-80">
                            ModernShop
                        </span>
                    </Link>
                </div>

                <nav className="hidden items-center gap-4 md:flex">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`px-3 py-2 text-sm font-medium transition ${pathname === l.href
                                    ? "rounded-md bg-slate-900 text-white shadow"
                                    : "text-slate-700 hover:text-slate-900"
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="/checkout" className="relative rounded-full p-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-slate-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9v9"
                            />
                        </svg>

                        {itemCount > 0 && (
                            <span className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setOpen((s) => !s)}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm md:hidden"
                        aria-label="Toggle menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-slate-100 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-10">
                        <div className="flex flex-col gap-2">
                            {links.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${pathname === l.href ? "bg-slate-900 text-white" : "text-slate-700 hover:text-slate-900"
                                        }`}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

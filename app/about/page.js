"use client";

import Link from "next/link";

export default function About() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">

                <div className="rounded-3xl bg-linear-to-r from-slate-900 via-slate-750 to-slate-500 p-8 text-white shadow-xl sm:p-12">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                        About Us
                    </p>

                    <h1 className="text-3xl font-bold sm:text-4xl">
                        We craft modern essentials for everyday life.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
                        Founded with a focus on thoughtful design, quality materials, and
                        a commitment to simplicity — we build products that belong in the
                        home, the office, and on the move.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Our Story
                        </h2>
                        <p className="mt-4 text-slate-600">
                            What started as a small studio has become a curated collection
                            of items designed to simplify daily routines. We obsess over
                            small details so our customers enjoy durable, elegant pieces.
                        </p>

                        <h3 className="mt-6 text-lg font-semibold">Mission & Values</h3>
                        <ul className="mt-3 space-y-2 text-slate-600">
                            <li>• Design with intention</li>
                            <li>• Build to last</li>
                            <li>• Transparent pricing</li>
                            <li>• Exceptional customer experience</li>
                        </ul>

                        <h3 className="mt-6 text-lg font-semibold">Why choose us</h3>
                        <p className="mt-3 text-slate-600">
                            We blend timeless aesthetics with modern materials and make
                            sure every product earns a place in your life.
                        </p>

                        <div className="mt-6">
                            <Link href="/products" className="inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800">
                                Browse Products
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <img src="https://placehold.co/800x600?text=Brand+Image" alt="Brand image" className="h-full w-full object-cover" />
                    </div>
                </div>
            </section>
        </main>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useCart } from "../components/CartProvider";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [searchError, setSearchError] = useState("");

    const { addToCart } = useCart();

    // Fetch all products when page loads
    useEffect(() => {
        let cancelled = false;

        const loadProducts = async () => {
            try {
                const res = await fetch("/api/product");

                if (!res.ok) {
                    throw new Error("Unable to load products");
                }

                const data = await res.json();

                if (!cancelled) {
                    setProducts(Array.isArray(data) ? data : []);
                    setError("");
                    setLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong"
                    );
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    // Search products
    const handleSearch = async () => {
        setSearchError("");
        setError("");

        // If search box is empty, fetch all products
        if (!query.trim()) {
            setLoading(true);

            try {
                const res = await fetch("/api/product");

                if (!res.ok) {
                    throw new Error("Unable to load products");
                }

                const data = await res.json();

                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }

            return;
        }

        try {
            setSearching(true);

            const res = await fetch("/api/aisearch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: query.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setProducts([]);
                setSearchError(
                    data.message ||
                    "Something went wrong with AI search"
                );
                return;
            }

            setProducts(
                Array.isArray(data.products)
                    ? data.products
                    : []
            );

            // Show notice if AI fallback happened (e.g. quota ran out)
            if (data.notice) {
                setSearchError(data.notice);
            }
        } catch (err) {
            setProducts([]);
            setSearchError(
                "Something went wrong. Please try again."
            );
        } finally {
            setSearching(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">

                {/* HERO SECTION */}
                <div className="rounded-3xl bg-linear-to-r from-slate-900 via-slate-750 to-slate-500 p-8 text-white shadow-xl sm:p-12">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                        Fresh picks
                    </p>

                    <h1 className="text-3xl font-bold sm:text-4xl">
                        Discover modern products in one place.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
                        Browse our curated catalog and find everything
                        you need with a clean, Tailwind-powered
                        storefront experience.
                    </p>
                </div>

                {/* SEARCH BAR */}
                <div className="mt-10 flex items-center gap-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        type="text"
                        placeholder="Search products..."
                        className="w-full border border-slate-300 bg-white px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />

                    <button
                        onClick={handleSearch}
                        disabled={searching}
                        className="ml-2 cursor-pointer rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {searching ? "Searching..." : "Search"}
                    </button>
                </div>

                {/* SEARCH ERROR / NOTICE */}
                {searchError && (
                    <div className="mt-4 rounded-xl border-2 border-red-400 bg-red-100 px-6 py-4 text-center">
                        <p className="text-lg font-semibold text-red-800">
                            ⚠️ {searchError}
                        </p>
                    </div>
                )}

                {/* PRODUCTS SECTION */}
                <div className="mt-10">

                    {/* LOADING */}
                    {loading ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                            Loading products...
                        </div>

                    ) : error ? (

                        /* GENERAL ERROR */
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 shadow-sm">
                            {error}
                        </div>

                    ) : products.length === 0 ? (

                        /* NO PRODUCTS */
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                            No products found.
                        </div>

                    ) : (

                        /* PRODUCT GRID */
                        <div className="grid cursor-pointer gap-6 md:grid-cols-2 xl:grid-cols-3">

                            {products.map((product) => (
                                <article
                                    key={product._id}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >

                                    {/* PRODUCT IMAGE */}
                                    <img
                                        src={
                                            product.image ||
                                            "https://placehold.co/600x400?text=Product"
                                        }
                                        alt={product.title || "Product"}
                                        className="h-48 w-full object-cover"
                                    />

                                    {/* PRODUCT CONTENT */}
                                    <div className="p-5">

                                        {/* CATEGORY + PRICE */}
                                        <div className="mb-3 flex items-center justify-between gap-3">

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                                {product.category || "General"}
                                            </span>

                                            <span className="text-lg font-bold text-slate-900">
                                                $
                                                {Number(
                                                    product.price || 0
                                                ).toFixed(2)}
                                            </span>

                                        </div>

                                        {/* TITLE */}
                                        <h2 className="text-xl font-semibold text-slate-900">
                                            {product.title}
                                        </h2>

                                        {/* DESCRIPTION */}
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {product.description}
                                        </p>

                                        {/* ADD TO CART */}
                                        <button onClick={() => addToCart(product)} className="mt-5 cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
                                            Add to cart
                                        </button>

                                    </div>
                                </article>
                            ))}

                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

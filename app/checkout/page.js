"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "../components/CartProvider";
import Link from "next/link";

export default function Checkout() {
    const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [shipping, setShipping] = useState(5.0);
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postal: "",
    });

    useEffect(() => {
        // Simple coupon logic
        if (coupon.trim().toUpperCase() === "SAVE10") {
            setDiscount(0.1);
        } else {
            setDiscount(0);
        }
    }, [coupon]);

    const total = useMemo(() => {
        const sub = subtotal || 0;
        const disc = sub * (discount || 0);
        return Math.max(0, sub - disc + (items.length ? shipping : 0));
    }, [subtotal, discount, shipping, items.length]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // basic validation
        if (!items.length) return;
        if (!form.fullName || !form.email || !form.address) {
            alert("Please fill required fields: name, email, address");
            return;
        }

        setLoading(true);

        try {
            // Send order to server
            const payload = {
                items: items.map(i => ({ _id: i._id, title: i.title, price: i.price, quantity: i.quantity, image: i.image })),
                subtotal,
                shipping,
                discount,
                total,
                customer: form,
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Order failed");
            }

            setConfirmed(true);
            clearCart();
        } catch (err) {
            alert("Something went wrong placing your order.");
        } finally {
            setLoading(false);
        }
    };

    if (confirmed) {
        return (
            <main className="min-h-screen bg-slate-50 text-slate-900">
                <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-10">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-900">Order Confirmed</h2>
                        <p className="mt-4 text-slate-600">Thank you for your purchase. A confirmation email is on its way.</p>
                        <div className="mt-6">
                            <Link href="/products" className="inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white">Continue Shopping</Link>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (!items || items.length === 0) {
        return (
            <main className="min-h-screen bg-slate-50 text-slate-900">
                <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-10">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-900">Your cart is empty</h2>
                        <p className="mt-4 text-slate-600">Looks like you haven't added anything yet.</p>
                        <div className="mt-6">
                            <Link href="/products" className="inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white">Continue Shopping</Link>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Customer information</h2>
                        <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Full name *</label>
                                <input value={form.fullName} onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))} className="w-full rounded-md border border-slate-200 px-3 py-2" required />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                                <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="w-full rounded-md border border-slate-200 px-3 py-2" required />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
                                <input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full rounded-md border border-slate-200 px-3 py-2" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Shipping address *</label>
                                <input value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} className="w-full rounded-md border border-slate-200 px-3 py-2" required />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
                                    <input value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} className="w-full rounded-md border border-slate-200 px-3 py-2" />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Postal code</label>
                                    <input value={form.postal} onChange={(e) => setForm(f => ({ ...f, postal: e.target.value }))} className="w-full rounded-md border border-slate-200 px-3 py-2" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Payment method</label>
                                <select className="w-full rounded-md border border-slate-200 px-3 py-2">
                                    <option>Card (demo)</option>
                                    <option>PayPal</option>
                                </select>
                            </div>

                            <div>
                                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800">
                                    {loading ? "Placing order..." : "Place Order"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <aside>
                        <h3 className="text-lg font-semibold text-slate-900">Order summary</h3>
                        <div className="mt-4 space-y-4">
                            {items.map((it) => (
                                <div key={it._id} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3">
                                    <img src={it.image || "https://placehold.co/120x80"} alt={it.title} className="h-16 w-24 rounded-md object-cover" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{it.title}</div>
                                                <div className="mt-1 text-sm text-slate-600">${Number(it.price || 0).toFixed(2)}</div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateQuantity(it._id, Math.max(1, (it.quantity || 1) - 1))} className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200">-</button>
                                                <div className="w-8 text-center">{it.quantity}</div>
                                                <button onClick={() => updateQuantity(it._id, (it.quantity || 1) + 1)} className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200">+</button>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <button onClick={() => removeFromCart(it._id)} className="text-sm text-red-600">Remove</button>
                                            <div className="text-sm font-semibold text-slate-900">${((Number(it.price || 0)) * (it.quantity || 0)).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-slate-600">Subtotal</div>
                                    <div className="font-semibold">${subtotal.toFixed(2)}</div>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="text-sm text-slate-600">Shipping</div>
                                    <div className="font-semibold">${items.length ? shipping.toFixed(2) : "0.00"}</div>
                                </div>

                                <div className="mt-3">
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Discount / coupon</label>
                                    <div className="flex gap-2">
                                        <input value={coupon} onChange={(e) => setCoupon(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2" placeholder="Enter code" />
                                        <button onClick={() => { }} className="rounded-md bg-gray-100 px-3 py-2">Apply</button>
                                    </div>
                                    {discount > 0 && <div className="mt-2 text-sm text-green-600">Coupon applied ({Math.round(discount * 100)}% off)</div>}
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <div className="text-sm font-semibold">Total</div>
                                    <div className="text-xl font-bold">${total.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

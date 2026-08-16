import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Order from "@/models/order";
import Login from "./Login";

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const token = (params && params.token) || "";
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
    const cookieStore = await cookies();
    const hasAuthCookie = cookieStore.get("admin_auth")?.value === "1";

    if (!hasAuthCookie && (!ADMIN_TOKEN || token !== ADMIN_TOKEN)) {
        return <Login />;
    }

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200).lean();

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
                <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>

                <div className="mt-6 grid gap-4">
                    {orders.map((o) => (
                        <div key={o._id.toString()} className="rounded-lg border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Order #{o._id.toString()}</div>
                                    <div className="mt-1 text-sm text-slate-600">{new Date(o.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="text-lg font-bold">${Number(o.total || 0).toFixed(2)}</div>
                            </div>

                            <div className="mt-3 grid gap-2 md:grid-cols-2">
                                <div>
                                    <div className="text-sm font-semibold">Customer</div>
                                    <div className="mt-1 text-sm text-slate-600">{o.customer?.fullName} — {o.customer?.email}</div>
                                    <div className="text-sm text-slate-600">{o.customer?.address}, {o.customer?.city} {o.customer?.postal}</div>
                                </div>

                                <div>
                                    <div className="text-sm font-semibold">Items</div>
                                    <ul className="mt-2 text-sm text-slate-600">
                                        {o.items.map(it => (
                                            <li key={it._id?.toString()} className="flex items-center justify-between">
                                                <span>{it.title} × {it.quantity}</span>
                                                <span className="font-semibold">${((it.price || 0) * (it.quantity || 0)).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}





"use client";

import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                // cookie set by server; reload so server-rendered page can see it
                window.location.reload();
            } else {
                setError("Invalid credentials");
                setLoading(false);
            }
        } catch (err) {
            setError("Network error");
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-2 shadow-xl shadow-slate-200/80">
                <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-700 bg-slate-900 p-8 text-left shadow-inner shadow-black/20 text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-white">Admin Login</h2>
                        <div className="mt-3 text-sm text-slate-300">Use username <strong className="text-white">admin</strong> and password <strong className="text-white">tttggg444</strong>.</div>
                    </div>

                    <div className="mt-2">
                        <label className="block text-sm font-medium text-slate-300">Username</label>
                        <input autoFocus value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2.5 text-white placeholder-slate-400 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/40" placeholder="Enter username" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2.5 text-white placeholder-slate-400 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/40" placeholder="Enter password" />
                    </div>

                    {error && <div className="text-sm text-red-400">{error}</div>}

                    <div>
                        <button disabled={loading} type="submit" className="inline-flex w-full justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

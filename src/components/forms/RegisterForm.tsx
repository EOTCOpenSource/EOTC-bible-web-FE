"use client";

import { useState } from "react";


export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setErr("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess("Registration successful! You can now sign in.");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (e: any) {
            setErr(e.message ?? "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="max-w-sm space-y-4">
            <input
                className="w-full border p-2 rounded"
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                className="w-full border p-2 rounded"
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <input
                className="w-full border p-2 rounded"
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
            />
            {err && <p className="text-red-600 text-sm">{err}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <button className="w-full border p-2 rounded" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </form>
    );
}
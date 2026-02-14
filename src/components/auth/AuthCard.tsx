"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function AuthCard() {
    const supabase = createSupabaseBrowser();
    const router = useRouter();

    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const fn =
            mode === "login"
                ? supabase.auth.signInWithPassword
                : supabase.auth.signUp;

        const { error } = await fn({ email, password });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        router.refresh();
        router.push("/");
    }

    return (
        <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
            <h1 className="text-xl font-semibold">
                {mode === "login" ? "Entrar" : "Criar conta"}
            </h1>
            <p className="mt-1 text-sm opacity-70">
                Email e senha (MVP). Depois a gente adiciona reset, confirmação, etc.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <div className="space-y-1">
                    <label className="text-sm">Email</label>
                    <input
                        className="w-full rounded-xl border px-3 py-2 outline-none"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm">Senha</label>
                    <input
                        className="w-full rounded-xl border px-3 py-2 outline-none"
                        type="password"
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                {error && (
                    <div className="rounded-xl border p-3 text-sm">
                        {error}
                    </div>
                )}

                <button
                    disabled={loading}
                    className="w-full rounded-xl border px-3 py-2 font-medium"
                    type="submit"
                >
                    {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
                </button>
            </form>

            <div className="mt-4 text-sm">
                {mode === "login" ? (
                    <button
                        className="underline opacity-80"
                        onClick={() => setMode("signup")}
                        type="button"
                    >
                        Criar uma conta
                    </button>
                ) : (
                    <button
                        className="underline opacity-80"
                        onClick={() => setMode("login")}
                        type="button"
                    >
                        Já tenho conta
                    </button>
                )}
            </div>
        </div>
    );
}

"use client";

import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const supabase = createSupabaseBrowser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function logout() {
        setLoading(true);
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
        setLoading(false);
    }

    return (
        <button
            onClick={logout}
            disabled={loading}
            className="rounded-xl border px-3 py-2"
        >
            {loading ? "Saindo..." : "Sair"}
        </button>
    );
}

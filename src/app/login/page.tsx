import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import AuthCard from "@/components/auth/AuthCard";

export default async function LoginPage() {
    const supabase = await createSupabaseServer();
    const { data } = await supabase.auth.getUser();

    if (data.user) redirect("/");

    return (
        <main className="min-h-screen grid place-items-center p-4">
            <AuthCard />
        </main>
    );
}

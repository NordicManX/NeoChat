import { createSupabaseServer } from "@/lib/supabase/server";

export async function getMyProfile() {
    const supabase = await createSupabaseServer();
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) throw userErr;
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, updated_at")
        .eq("id", userData.user.id)
        .maybeSingle();

    if (error) throw error;

    // Se ainda não existir (ex: user antigo), retorna null sem explodir
    return data ?? null;
}

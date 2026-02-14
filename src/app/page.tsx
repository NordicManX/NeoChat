import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function Home() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold">Você está logado ✅</h1>
        <p className="mt-2 opacity-80">User: {data.user.email}</p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}

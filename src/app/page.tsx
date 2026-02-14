import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";
import { getMyProfile } from "@/lib/profile/getMyProfile";

export default async function Home() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const profile = await getMyProfile();

  {
    profile ? (
      <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(profile, null, 2)}</pre>
    ) : (
      <p className="mt-2 text-sm opacity-70">
        Profile não encontrado ainda (rode o backfill no Supabase).
      </p>
    )
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold">Você está logado ✅</h1>
        <p className="opacity-80">User: {data.user.email}</p>

        <div className="rounded-2xl border p-4">
          <div className="font-medium">Meu profile</div>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>

        <LogoutButton />
      </div>
    </main>
  );
}

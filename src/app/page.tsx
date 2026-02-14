"use client";
import { supabase } from "@/lib/supabase/client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log("Supabase:", supabase);
  }, []);

  return <div>Supabase conectado 🚀</div>;
}

"use client";
import { getToken } from "@/@lib/tokens";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const t = getToken();
    router.replace(t ? "/app/todos" : "/login");
  }, [router]);
  return <div className="p-6">Redirecting…</div>;
}

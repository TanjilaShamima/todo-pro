"use client";
import type { RootState } from "@/@store";
import { boot } from "@/@store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, booted } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    dispatch(boot());
  }, [dispatch]);

  useEffect(() => {
    if (!booted) return;
    if (token === null) router.replace("/login");
  }, [token, booted, router]);
  if (!booted) return <div className="p-6">Checking session…</div>;
  if (token === null) return null;
  return <>{children}</>;
}

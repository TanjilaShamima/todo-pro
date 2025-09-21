"use client";
import type { RootState } from "@/@store";
import { boot } from "@/@store/slices/authSlice";
import { Loader2 } from "lucide-react";
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
  const { token, user, booted } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    dispatch(boot());
  }, [dispatch]);

  useEffect(() => {
    if (!booted) return;
    if (token === null || !user) router.replace("/");
  }, [token, user, booted, router]);
  if (!booted)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader2 className="h-10 w-10" />
      </div>
    );
  if (token === null || !user) return null;
  return <>{children}</>;
}

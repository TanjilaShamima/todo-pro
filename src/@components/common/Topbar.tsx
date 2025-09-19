"use client";
import type { RootState } from "@/@store";
import { logout } from "@/@store/slices/authSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function Topbar() {
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto p-3 flex items-center gap-3 justify-between">
        <Link href="/app/todos" className="font-semibold">
          Todo Pro
        </Link>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm opacity-80">{user.name}</span>}
          <button className="btn" onClick={() => dispatch(logout())}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

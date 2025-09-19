"use client";
import type { RootState } from "@/@store";
import { logout } from "@/@store/slices/authSlice";
import { toggleTheme } from "@/@store/slices/uiSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function Topbar() {
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const theme = useSelector((s: RootState) => s.ui.theme);

  console.log("selected user:", user);
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto p-3 flex items-center gap-3 justify-between">
        <Link href="/app/todos" className="font-semibold">
          Todo Pro
        </Link>
        <div className="flex items-center gap-3">
          <button
            className="btn"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-label="Toggle theme"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? "🌞 Light" : "🌙 Dark"}
          </button>
          {user && <span className="text-sm opacity-80">{user.name}</span>}
          {user ? (
            <button className="btn" onClick={() => dispatch(logout())}>
              Logout
            </button>
          ) : (
            <Link href="/login" className="btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

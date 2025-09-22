"use client";
import type { RootState } from "@/@store";
import { logout } from "@/@store/slices/authSlice";
import { toggleTheme } from "@/@store/slices/uiSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";

export default function Topbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const theme = useSelector((s: RootState) => s.ui.theme);

  return (
    <header className="sticky top-0 z-40 isolate bg-primary-bg border-b py-2">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3 justify-between">
        <Link href="/app/todos" className="font-semibold text-foreground">
          Todo Pro
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            aria-label="Toggle theme"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={() => dispatch(toggleTheme())}
            className="px-2 py-1"
          >
            {theme === "light" ? "🌙 Dark" : "🌞 Light"}
          </Button>
          {user && (
            <span className="text-xs sm:text-sm opacity-80 text-foreground hidden sm:inline">
              {user.name}
            </span>
          )}
          {user ? (
            <Button variant="selected" onClick={() => dispatch(logout())}>
              Logout
            </Button>
          ) : (
            <Button
              variant="selected"
              className="px-5 py-1 !text-white"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";
import type { RootState } from "@/@store";
import { setTheme } from "@/@store/slices/uiSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ThemeClient() {
  const theme = useSelector((s: RootState) => s.ui.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const saved =
      (localStorage.getItem("theme") as "light" | "dark" | null) || null;
    if (saved) dispatch(setTheme(saved));
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("bg-grad-light", theme === "light");
    document.body.classList.toggle("bg-grad-dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return null;
}

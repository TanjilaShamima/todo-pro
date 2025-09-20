"use client";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "selected" | "ghost";
};

export default function Button({
  className,
  variant = "primary",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";

  const styles =
    variant === "primary"
      ? "bg-[var(--button-bg)] text-[var(--button-text)] hover:opacity-95 focus:ring-[var(--primary-color)]"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
      : variant === "selected"
      ? "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] cursor-default"
      : "bg-transparent text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 border border-transparent !cursor-not-allowed";

  return <button className={clsx(base, styles, className)} {...rest} />;
}

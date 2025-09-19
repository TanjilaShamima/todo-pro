"use client";
import clsx from "clsx";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "ghost";
};
export default function Button({
  className,
  variant = "primary",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-transparent hover:bg-black/5 dark:hover:bg-white/10";
  return <button className={clsx(base, styles, className)} {...rest} />;
}

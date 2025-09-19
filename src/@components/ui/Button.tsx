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
    "inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "text-white hover:opacity-90 cursor-pointer"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
      : variant === "selected"
      ? "bg-black text-gray-300 cursor-default"
      : "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 cursor-not-allowed";
  return <button className={clsx(base, styles, className)} {...rest} />;
}

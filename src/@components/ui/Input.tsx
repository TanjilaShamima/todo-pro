"use client";
import clsx from "clsx";
type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };
export default function Input({ className, label, ...rest }: Props) {
  return (
    <label className="grid gap-1">
      {label && <span className="text-sm opacity-80">{label}</span>}
      <input
        className={clsx(
          "input px-3 py-2 rounded border border-black/10 dark:border-white/10 bg-white/90 dark:bg-white/5",
          className
        )}
        {...rest}
      />
    </label>
  );
}

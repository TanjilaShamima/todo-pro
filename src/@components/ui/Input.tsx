"use client";
import clsx from "clsx";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };
export default function Input({ className, label, ...rest }: Props) {
  return (
    <label className="grid gap-1">
      {label && <span className="text-sm opacity-80">{label}</span>}
      <input
        className={clsx(
          "px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2",
          className
        )}
        {...rest}
      />
    </label>
  );
}

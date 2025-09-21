"use client";
import clsx from "clsx";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export default function PasswordInput({ className, label, ...rest }: Props) {
  const [show, setShow] = useState(false);
  return (
    <label className="grid gap-1">
      {label && <span className="text-sm opacity-80">{label}</span>}
      <div className="relative">
        <span className="absolute inset-y-0 left-2 inline-flex items-center text-[var(--muted)]">
          <Lock size={16} />
        </span>
        <input
          className={clsx(
            "w-full pl-8 pr-9 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2",
            className
          )}
          type={show ? "text" : "password"}
          {...rest}
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-2 inline-flex items-center text-[var(--muted)] hover:opacity-80"
          onClick={() => setShow((s) => !s)}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}

"use client";
import clsx from "clsx";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
  inputClassName?: string;
  label?: string;
  className?: string;
};

export default function Search({
  containerClassName,
  inputClassName,
  className,
  label,
  ...rest
}: Props) {
  return (
    <label className={clsx("inline-flex flex-col gap-1", containerClassName)}>
      {label && <span className="text-sm opacity-80">{label}</span>}
      <input
        {...rest}
        className={clsx(
          "px-3 py-2 rounded-md",
          // Transparent background in both themes
          "bg-transparent",
          // Use theme variable for input color (light=black, dark=white)
          "text-[var(--color-input)] placeholder:text-[var(--color-input)] placeholder:opacity-60",
          // Border uses the same color variable
          "border border-[var(--color-input)]",
          // Accessible focus ring in primary, keep border in input color
          "outline-none focus:border-[var(--color-input)] focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-1",
          className,
          inputClassName
        )}
      />
    </label>
  );
}

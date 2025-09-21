"use client";

export default function Skleton({
  className = "h-4 w-full",
}: {
  className?: string;
}) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-md bg-[var(--surface)]/80 " +
        className
      }
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10" />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

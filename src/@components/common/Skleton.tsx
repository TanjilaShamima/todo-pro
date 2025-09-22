"use client";

export default function Skleton({
  className = "h-4 w-full",
}: {
  className?: string;
}) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-md bg-[var(--skeleton-base)]/50 " +
        className
      }
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-[var(--skeleton-highlight)] to-transparent" />
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

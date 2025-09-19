"use client";
import Button from "./Button";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
};

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, start + 2);
  const pages: number[] = [];
  for (let p = Math.max(1, end - 2); p <= end; p++) pages.push(p);

  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      <Button
        variant="ghost"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "primary" : "ghost"}
          aria-current={p === page ? "page" : undefined}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      <Button
        variant="ghost"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}

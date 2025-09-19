"use client";
import Pagination from "@/@components/ui/Pagination";
import { useListTodosQuery } from "@/@store/services/todoApi";
import TodoItem from "./TodoItem";

type Props = {
  page: number;
  q: string;
  status: "all" | "todo" | "in_progress" | "done";
  sort: "createdAt" | "dueDate" | "priority";
};

export default function TodoList({ page, q, status, sort }: Props) {
  const { data, isLoading, isError } = useListTodosQuery({
    page,
    q,
    status,
    sort,
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError)
    return (
      <p role="alert" className="text-red-600">
        Failed to load todos.
      </p>
    );
  if (!data || data.items.length === 0) return <p>No todos found.</p>;

  return (
    <>
      <ul className="divide-y">
        {data.items.map((t) => (
          <TodoItem key={t.id} todo={t} />
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-center">
        <Pagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={(p) =>
            window.dispatchEvent(
              new CustomEvent("todos:page-goto", { detail: { p } })
            )
          }
        />
      </div>
    </>
  );
}

"use client";
import { useGetTodoQuery } from "@/@store/services/todoApi";

export default function TodoDetailsFeature({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetTodoQuery(id);

  if (isLoading) return <p>Loading todo…</p>;
  if (isError) return <p className="text-red-600">Error loading todo</p>;
  if (!data) return <p>Todo not found.</p>;

  return (
    <div className="max-w-xl mx-auto space-y-3 my-12">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p className="text-gray-500">{data.description}</p>
      <p>Status: {data.status}</p>
      <p>Priority: {data.priority ?? "—"}</p>
      <p>
        Due:{" "}
        {data.dueDate ? new Date(data.dueDate).toLocaleString() : "no due date"}
      </p>
    </div>
  );
}

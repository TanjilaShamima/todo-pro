"use client";
import TodoForm from "@/@components/Todo/TodoForm";
import Modal from "@/@components/ui/Modal";
import {
  useDeleteTodoMutation,
  useListTodosQuery,
  useUpdateTodoMutation,
} from "@/@store/services/todoApi";
import { useState } from "react";

export default function TodosFeature() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "todo" | "in_progress" | "done">(
    "all"
  );
  const [sort, setSort] = useState<"createdAt" | "dueDate" | "priority">(
    "createdAt"
  );
  const { data, isLoading, isError } = useListTodosQuery({
    page,
    q,
    status,
    sort,
  });
  // creation handled inside modal form
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <main className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Todos</h1>
          <button className="btn" onClick={() => setOpen(true)}>
            + Quick Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            className="input"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input"
            value={status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setStatus(e.target.value as typeof status)
            }
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            className="input"
            value={sort}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSort(e.target.value as typeof sort)
            }
          >
            <option value="createdAt">Created</option>
            <option value="dueDate">Due</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {isLoading && <p>Loading…</p>}
        {isError && (
          <p role="alert" className="text-red-600">
            Failed to load todos.
          </p>
        )}
        {data && data.items.length === 0 && <p>No todos found.</p>}

        <ul className="divide-y">
          {data?.items.map((t) => (
            <li key={t.id} className="py-3 flex items-start gap-3">
              <input
                aria-label="Status"
                type="checkbox"
                checked={t.status === "done"}
                onChange={() =>
                  updateTodo({
                    id: t.id,
                    status: t.status === "done" ? "todo" : "done",
                  })
                }
              />
              <div className="flex-1">
                <div className="font-medium">{t.title}</div>
                <div className="text-sm opacity-80">{t.description}</div>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (confirm("Delete?")) deleteTodo(t.id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between">
          <button
            className="btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <div>Page {data?.page ?? page}</div>
          <button
            className="btn"
            disabled={(data?.page ?? 1) * 10 >= (data?.total ?? 0)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </main>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Todo">
        <TodoForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

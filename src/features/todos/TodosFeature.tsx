"use client";
import TodoFilter from "@/@components/Todo/TodoFilter";
import TodoForm from "@/@components/Todo/TodoForm";
import TodoList from "@/@components/Todo/TodoList";
import TodoSearch from "@/@components/Todo/TodoSearch";
import Button from "@/@components/ui/Button";
import Modal from "@/@components/ui/Modal";
import type { AppDispatch } from "@/@store";
import { fetchTodos } from "@/@store/slices/todoSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function TodosFeature() {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "todo" | "in_progress" | "done">(
    "all"
  );
  const [sort, setSort] = useState<"createdAt" | "dueDate" | "priority">(
    "createdAt"
  );
  useEffect(() => {
    const goto = (e: Event) => {
      const detail = (e as CustomEvent<{ p: number }>).detail;
      if (detail?.p) setPage(detail.p);
    };
    window.addEventListener("todos:page-goto", goto as EventListener);
    return () => {
      window.removeEventListener("todos:page-goto", goto as EventListener);
    };
  }, []);
  const [open, setOpen] = useState(false);

  // Hydrate slice for other consumers; list rendering still via RTK Query
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 min-h-screen">
        <div className="flex items-center justify-between my-5">
          <h1 className="text-2xl font-semibold">Todos</h1>
          <Button variant="selected" onClick={() => setOpen(true)}>
            + Quick Add
          </Button>
        </div>

        <div className="w-full flex flex-wrap justify-between mb-10">
          <TodoSearch value={q} onChange={setQ} />
          <TodoFilter
            status={status}
            onStatus={setStatus}
            sort={sort}
            onSort={setSort}
          />
        </div>

        <TodoList page={page} q={q} status={status} sort={sort} />
      </main>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Todo">
        <TodoForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

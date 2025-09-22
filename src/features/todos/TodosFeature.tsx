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
  const [limit, setLimit] = useState<number | "all">(10);
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

        <div className="w-full lg:flex items-center justify-between gap-3 mb-10">
          <div className="w-full flex items-center gap-3 mb-3 lg:mb-0">
            <TodoSearch value={q} onChange={setQ} />
          </div>
          <div className="w-full mb-3 lg:mb-0">
            <label className="text-sm opacity-80">
            Limit
            <select
              className="input border rounded-md px-3 py-2 ml-2"
              value={String(limit)}
              onChange={(e) => {
                const v = e.target.value;
                setLimit(v === "all" ? "all" : Number(v));
              }}
            >
              <option className="text-black" value="5">5</option>
              <option className="text-black " value="10">10</option>
              <option className="text-black" value="15">15</option>
              <option className="text-black" value="20">20</option>
              <option className="text-black" value="all">All</option>
            </select>
          </label>
          </div>
          <TodoFilter
            status={status}
            onStatus={setStatus}
            sort={sort}
            onSort={setSort}
          />
        </div>

        <TodoList page={page} q={q} status={status} sort={sort} limit={limit} />
      </main>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Todo">
        <TodoForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

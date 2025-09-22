"use client";
import Skleton from "@/@components/common/Skleton";
import Pagination from "@/@components/ui/Pagination";
import { useMswReady } from "@/@lib/useMswReady";
import type { RootState } from "@/@store";
import { useListTodosQuery } from "@/@store/services/todoApi";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TodoItem from "./TodoItem";

type Props = {
  page: number;
  q: string;
  status: "all" | "todo" | "in_progress" | "done";
  sort: "createdAt" | "dueDate" | "priority";
  limit?: number | "all";
  priority?: "all" | "low" | "medium" | "high";
};

export default function TodoList({
  page,
  q,
  status,
  sort,
  limit,
  priority,
}: Props) {
  const mswReady = useMswReady();
  const { booted, token } = useSelector((s: RootState) => s.auth);
  const canQuery = mswReady && booted && !!token;
  const { data, isLoading, isError } = useListTodosQuery(
    {
      page,
      q,
      status,
      sort,
      ...(limit ? { limit } : {}),
      ...(priority && priority !== "all" ? { priority } : {}),
    },
    { skip: !canQuery }
  );

  // Local ordered items state for DnD without touching server
  const [ordered, setOrdered] = useState(() => data?.items ?? []);
  useEffect(() => {
    if (data?.items) setOrdered(data.items);
  }, [data?.items]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const ids = useMemo(() => ordered.map((t) => t.id), [ordered]);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = ordered.findIndex((t) => t.id === active.id);
    const newIndex = ordered.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setOrdered((items) => arrayMove(items, oldIndex, newIndex));
    // TODO: Optionally persist order via API or Redux slice
  }

  if (isLoading)
    return (
      <ul className="">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i} className="py-3">
            <div className="flex items-center gap-3">
              <Skleton className="h-5 w-full" />
              <div className="flex-1">
                <Skleton className="h-4 w-1/3 mb-2" />
                <Skleton className="h-3 w-1/2" />
              </div>
              <Skleton className="h-8 w-16" />
            </div>
          </li>
        ))}
      </ul>
    );
  if (canQuery && isError)
    return (
      <p role="alert" className="text-red-600">
        Failed to load todos.
      </p>
    );
  if (!data || ordered.length === 0) return <p>No todos found.</p>;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul className="divide-y">
            {ordered.map((t) => (
              <SortableRow key={t.id} id={t.id}>
                {(sortableProps) => <TodoItem todo={t} {...sortableProps} />}
              </SortableRow>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
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

type SortableProps = {
  attributes: React.HTMLAttributes<HTMLElement>;
  listeners?: Record<string, unknown>;
  setNodeRef: (el: HTMLElement | null) => void;
  style: React.CSSProperties;
};

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (p: SortableProps) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : undefined,
    background: isDragging ? "var(--background)" : undefined,
  };
  return <>{children({ attributes, listeners, setNodeRef, style })}</>;
}

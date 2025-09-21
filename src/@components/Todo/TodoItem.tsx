"use client";
import {
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "@/@store/services/todoApi";
import type { TodoType } from "@/@types/todo";
// Note: We accept generic HTML attributes/listeners from useSortable wrappers
import Modal from "@/@components/ui/Modal";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type DndProps = {
  attributes?: React.HTMLAttributes<HTMLElement>;
  listeners?: Record<string, unknown>;
  setNodeRef?: (el: HTMLElement | null) => void;
  style?: React.CSSProperties;
};

export default function TodoItem({
  todo,
  attributes,
  listeners,
  setNodeRef,
  style,
}: { todo: TodoType } & DndProps) {
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="py-3 flex items-start gap-3"
      onClick={() => router.push(`/app/todos/${todo.id}`)}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        title="Drag"
        className="cursor-grab select-none opacity-70 hover:opacity-100"
        {...listeners}
      >
        ⠿
      </button>
      <input
        aria-label="Status"
        type="checkbox"
        checked={todo.status === "done"}
        onChange={() =>
          updateTodo({
            id: todo.id,
            status: todo.status === "done" ? "todo" : "done",
          })
        }
      />
      <div className="flex-1">
        <div className="font-medium">{todo.title}</div>
        <div className="text-sm opacity-80">{todo.description}</div>
      </div>
      <button className="btn btn-danger cursor-pointer" onClick={() => setConfirmOpen(true)}>
        Delete
      </button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm delete"
      >
        <p className="mb-4">Are you sure you want to delete this todo?</p>
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={() => setConfirmOpen(false)}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              deleteTodo(todo.id);
              setConfirmOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </li>
  );
}

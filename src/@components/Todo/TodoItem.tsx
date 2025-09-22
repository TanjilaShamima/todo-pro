"use client";
import {
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "@/@store/services/todoApi";
import type { TodoType } from "@/@types/todo";
// Note: We accept generic HTML attributes/listeners from useSortable wrappers
import Modal from "@/@components/ui/Modal";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import TodoEditModal from "./TodoEditModal";

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
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();
  const isOverdue = !!(
    todo.dueDate &&
    new Date(todo.dueDate).getTime() < Date.now() &&
    todo.status !== "done"
  );
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="py-3 flex items-start gap-3 cursor-pointer"
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        title="Drag"
        className="cursor-grab select-none opacity-70 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
        }}
        {...listeners}
      >
        ⠿
      </button>

      <input
        aria-label="Status"
        type="checkbox"
        checked={todo.status === "done"}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={async (e) => {
          e.stopPropagation();
          try {
            await updateTodo({
              id: todo.id,
              status: todo.status === "done" ? "todo" : "done",
            }).unwrap();
            toast.success("Status updated");
          } catch {
            toast.error("Failed to update status");
          }
        }}
      />

      <div
        className="flex-1"
        onClick={() => router.push(`/app/todos/${todo.id}`)}
      >
        <div className="font-medium flex items-center gap-2 flex-wrap mb-2">
          <span>{todo.title}</span>
          {/* Badges */}
          <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/70">
            {todo.status.replace("_", " ")}
          </span>
          {todo.priority && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/70">
              {todo.priority}
            </span>
          )}
          {todo.dueDate && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/70">
              due at {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
          {isOverdue && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-600">
              Overdue
            </span>
          )}
        </div>
        <div className="text-sm opacity-80">
          {(() => {
            const d = todo.description || "";
            return d.length > 100 ? `${d.slice(0, 100)}...` : d;
          })()}
        </div>
      </div>

      <Button
        variant="danger"
        className="btn btn-danger cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setConfirmOpen(true);
        }}
      >
        Delete
      </Button>

      <Button
        className="btn cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setEditOpen(true);
        }}
      >
        Update
      </Button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm delete"
      >
        <p className="mb-4">Are you sure you want to delete this todo?</p>
        <div className="flex justify-end gap-5">
          <Button className="btn" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="btn"
            onClick={async () => {
              try {
                await deleteTodo(todo.id).unwrap();
                toast.success("Todo deleted");
              } catch {
                toast.error("Failed to delete");
              }
              setConfirmOpen(false);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <TodoEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        todo={todo}
      />
    </li>
  );
}

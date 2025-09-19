"use client";
import {
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "@/@store/services/todoApi";
import type { TodoType } from "@/@types/todo";
import type { DraggableAttributes, SyntheticListenerMap } from "@dnd-kit/core";
import type React from "react";

type DndProps = {
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
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
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="py-3 flex items-start gap-3"
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
      <button
        className="btn btn-danger"
        onClick={() => {
          if (confirm("Delete?")) deleteTodo(todo.id);
        }}
      >
        Delete
      </button>
    </li>
  );
}

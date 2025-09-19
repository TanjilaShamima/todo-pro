"use client";
import {
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "@/@store/services/todoApi";
import type { TodoType } from "@/@types/todo";

export default function TodoItem({ todo }: { todo: TodoType }) {
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  return (
    <li className="py-3 flex items-start gap-3">
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

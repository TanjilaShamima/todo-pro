"use client";
import Button from "@/@components/ui/Button";
import { TodoInput, todoSchema } from "@/@schemas/zodSchema";
import type { AppDispatch } from "@/@store";
import { todosApi } from "@/@store/services/todoApi";
import { createTodo } from "@/@store/slices/todoSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";

export default function TodoForm({ onSuccess }: { onSuccess?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.input<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: { status: "todo", priority: "medium", tags: [] },
  });

  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        const parsed: TodoInput = todoSchema.parse(v);
        await dispatch(createTodo(parsed)).unwrap();
        onSuccess?.();
        dispatch(todosApi.util.invalidateTags([{ type: "Todos", id: "LIST" }]));
        reset();
      })}
      className="grid gap-3 bg-[var(--surface)] p-4 rounded-lg border border-[var(--border)]"
    >
      <input
        className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2"
        placeholder="Title"
        {...register("title")}
      />
      {errors.title && (
        <p className="text-red-600 text-sm">{errors.title.message}</p>
      )}
      <textarea
        className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 min-h-24"
        placeholder="Description"
        {...register("description")}
      />
      <div className="flex gap-3">
        <select
          className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none"
          {...register("status")}
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none"
          {...register("priority")}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none"
          type="datetime-local"
          {...register("dueDate", {
            setValueAs: (v: string) => {
              if (!v || v.trim() === "") return undefined;
              const d = new Date(v);
              return isNaN(d.getTime()) ? undefined : d.toISOString();
            },
          })}
        />
      </div>
      {errors.dueDate && (
        <p className="text-red-600 text-sm">
          {errors.dueDate.message as string}
        </p>
      )}
      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="submit" disabled={isSubmitting}>
          Create
        </Button>
      </div>
    </form>
  );
}

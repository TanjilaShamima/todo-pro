"use client";
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
        // if success, close the modal and refetch list
        onSuccess?.();
        // invalidate list so RTK Query refetches current page
        dispatch(todosApi.util.invalidateTags([{ type: "Todos", id: "LIST" }]));
        reset();
      })}
      className="grid gap-3"
    >
      <input className="input" placeholder="Title" {...register("title")} />
      {errors.title && (
        <p className="text-red-600 text-sm">{errors.title.message}</p>
      )}
      <textarea
        className="input"
        placeholder="Description"
        {...register("description")}
      />
      <div className="flex gap-3">
        <select className="input" {...register("status")}>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select className="input" {...register("priority")}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          className="input"
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
      <button className="btn" disabled={isSubmitting}>
        Create
      </button>
    </form>
  );
}

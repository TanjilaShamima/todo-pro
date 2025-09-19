"use client";
import { TodoInput, todoSchema } from "@/@schemas/zodSchema";
import { useCreateTodoMutation } from "@/@store/services/todoApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function TodoForm({ onSuccess }: { onSuccess?: () => void }) {
  const [createTodo] = useCreateTodoMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TodoInput>({ resolver: zodResolver(todoSchema) });

  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        console.log("here");
        const res = await createTodo(v);
        console.log("here");
        // if success, close the modal
        if ("data" in res) onSuccess?.();
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

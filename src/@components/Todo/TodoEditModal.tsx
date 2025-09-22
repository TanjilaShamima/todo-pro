"use client";
import Button from "@/@components/ui/Button";
import Modal from "@/@components/ui/Modal";
import { useUpdateTodoMutation } from "@/@store/services/todoApi";
import type { TodoType } from "@/@types/todo";
import { toast } from "react-toastify";

export default function TodoEditModal({
  open,
  onClose,
  todo,
}: {
  open: boolean;
  onClose: () => void;
  todo: TodoType;
}) {
  const [updateTodo] = useUpdateTodoMutation();

  // Format ISO string to local "YYYY-MM-DDTHH:mm" for datetime-local input
  const toLocalInputValue = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit todo">
      <form
        className="grid gap-3 w-[min(90vw,28rem)]"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await updateTodo({
              id: todo.id,
              description:
                (
                  e.currentTarget.elements.namedItem(
                    "description"
                  ) as HTMLTextAreaElement
                )?.value || undefined,
              status: (
                e.currentTarget.elements.namedItem(
                  "status"
                ) as HTMLSelectElement
              )?.value as TodoType["status"],
              priority: ((
                e.currentTarget.elements.namedItem(
                  "priority"
                ) as HTMLSelectElement
              )?.value || undefined) as TodoType["priority"] | undefined,
              dueDate: (() => {
                const v = (
                  e.currentTarget.elements.namedItem(
                    "dueDate"
                  ) as HTMLInputElement
                )?.value;
                if (!v) return undefined;
                const d = new Date(v);
                return isNaN(d.getTime()) ? undefined : d.toISOString();
              })(),
            }).unwrap();
            toast.success("Todo updated");
            onClose();
          } catch {
            toast.error("Failed to update todo");
          }
        }}
      >
        <label className="text-sm opacity-80">Title (read-only)</label>
        <input
          className="px-3 py-2 rounded border border-[var(--border)] bg-white text-black"
          value={todo.title}
          readOnly
        />

        <label className="text-sm opacity-80">Description</label>
        <textarea
          name="description"
          defaultValue={todo.description || ""}
          className="px-3 py-2 rounded border border-[var(--border)] bg-white text-black"
          maxLength={500}
        />

        <div className="flex gap-3">
          <label className="flex-1 text-sm opacity-80">
            <span className="block mb-1">Status</span>
            <select
              name="status"
              defaultValue={todo.status}
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-white text-black"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>
          <label className="flex-1 text-sm opacity-80">
            <span className="block mb-1">Priority</span>
            <select
              name="priority"
              defaultValue={todo.priority || ""}
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-white text-black"
            >
              <option value="">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <label className="text-sm opacity-80">
          <span className="block mb-1">Due date</span>
          <input
            name="dueDate"
            type="datetime-local"
            defaultValue={toLocalInputValue(todo.dueDate)}
            className="w-full px-3 py-2 rounded border border-[var(--border)] bg-white text-black"
          />
        </label>

        <div className="flex justify-end gap-5 pt-2">
          <Button type="button" className="btn" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="selected" type="submit" className="btn !px-5">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

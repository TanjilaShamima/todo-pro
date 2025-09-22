"use client";
import Skleton from "@/@components/common/Skleton";
import Button from "@/@components/ui/Button";
import { useGetTodoQuery } from "@/@store/services/todoApi";
import { useRouter } from "next/navigation";

export default function TodoDetailsFeature({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetTodoQuery(id);
  const router = useRouter();

  if (isLoading)
    return (
      <div className="max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-[var(--border)]/60 bg-[var(--surface)]/30 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skleton className="h-8 w-2/3" />
            <div className="flex gap-2">
              <Skleton className="h-5 w-20" />
              <Skleton className="h-5 w-16" />
              <Skleton className="h-5 w-32" />
            </div>
          </div>
          <Skleton className="h-9 w-20 rounded-md" />
        </div>

        <div className="mt-6 space-y-3">
          <Skleton className="h-4 w-full" />
          <Skleton className="h-4 w-5/6" />
          <Skleton className="h-4 w-4/6" />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-[var(--border)]/60 bg-[var(--surface)]/40 p-4">
            <Skleton className="h-3 w-20 mb-2" />
            <Skleton className="h-4 w-32" />
          </div>
          <div className="rounded-lg border border-[var(--border)]/60 bg-[var(--surface)]/40 p-4">
            <Skleton className="h-3 w-24 mb-2" />
            <Skleton className="h-4 w-24" />
          </div>
          <div className="rounded-lg border border-[var(--border)]/60 bg-[var(--surface)]/40 p-4">
            <Skleton className="h-3 w-16 mb-2" />
            <Skleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="max-w-3xl mx-auto p-6 my-12 rounded-xl bg-red-500/10 text-red-700 border border-red-500/30">
        <p>Error loading todo</p>
      </div>
    );
  if (!data)
    return (
      <div className="max-w-3xl mx-auto p-6 my-12 rounded-xl bg-[var(--surface)]/40 backdrop-blur-md border border-[var(--border)]/60 shadow-sm">
        <p>Todo not found.</p>
        <div className="mt-4">
          <Button onClick={() => router.push("/app/todos")}>
            Back to list
          </Button>
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto my-12 p-6 md:p-8 rounded-2xl border border-[var(--border)]/60 bg-[var(--surface)]/30 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            {data.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/70">
              {data.status.replace("_", " ")}
            </span>
            {data.priority && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/70">
                {data.priority}
              </span>
            )}
            {data.dueDate && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/70">
                due {new Date(data.dueDate).toLocaleString()}
              </span>
            )}
            {data.dueDate &&
              new Date(data.dueDate).getTime() < Date.now() &&
              data.status !== "done" && (
                <span className="text-xs px-2 py-0.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-600">
                  Overdue
                </span>
              )}
          </div>
        </div>
        <Button className="!px-4" onClick={() => router.push("/app/todos")}>
          Back
        </Button>
      </div>

      {data.description && (
        <p className="mt-6 text-[var(--muted)] leading-relaxed">
          {data.description}
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-[var(--border)]/60 bg-[var(--surface)]/40 p-4">
          <div className="text-xs uppercase tracking-wide opacity-70">
            Status
          </div>
          <div className="mt-1 font-medium">{data.status}</div>
        </div>
        <div className="rounded-lg border border-[var(--border)]/60 bg-[var(--surface)]/40 p-4">
          <div className="text-xs uppercase tracking-wide opacity-70">
            Priority
          </div>
          <div className="mt-1 font-medium">{data.priority ?? "—"}</div>
        </div>
        <div className="rounded-lg border border-[var(--border)]/60 bg-[var(--surface)]/40 p-4">
          <div className="text-xs uppercase tracking-wide opacity-70">Due</div>
          <div className="mt-1 font-medium">
            {data.dueDate
              ? new Date(data.dueDate).toLocaleString()
              : "no due date"}
          </div>
        </div>
      </div>
    </div>
  );
}

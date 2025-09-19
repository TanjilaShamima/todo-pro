"use client";
type Props = {
  status: "all" | "todo" | "in_progress" | "done";
  onStatus: (s: Props["status"]) => void;
  sort: "createdAt" | "dueDate" | "priority";
  onSort: (s: Props["sort"]) => void;
};
export default function TodoFilter({ status, onStatus, sort, onSort }: Props) {
  return (
    <>
      <select
        className="input"
        value={status}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onStatus(e.target.value as Props["status"])
        }
      >
        <option value="all">All</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select
        className="input"
        value={sort}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onSort(e.target.value as Props["sort"])
        }
      >
        <option value="createdAt">Created</option>
        <option value="dueDate">Due</option>
        <option value="priority">Priority</option>
      </select>
    </>
  );
}

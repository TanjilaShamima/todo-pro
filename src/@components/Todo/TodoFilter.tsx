"use client";
type Props = {
  status: "all" | "todo" | "in_progress" | "done";
  onStatus: (s: Props["status"]) => void;
  sort: "createdAt" | "dueDate" | "priority";
  onSort: (s: Props["sort"]) => void;
  priority: "all" | "low" | "medium" | "high";
  onPriority: (p: Props["priority"]) => void;
};
export default function TodoFilter({
  status,
  onStatus,
  sort,
  onSort,
  priority,
  onPriority,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <select
        className="input border rounded-md px-3 py-2"
        value={status}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onStatus(e.target.value as Props["status"])
        }
      >
        <option className="text-black" value="all">
          All
        </option>
        <option className="text-black" value="todo">
          Todo
        </option>
        <option className="text-black" value="in_progress">
          In Progress
        </option>
        <option className="text-black" value="done">
          Done
        </option>
      </select>
      <select
        className="input border rounded-md px-3 py-2"
        value={priority}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onPriority(e.target.value as Props["priority"])
        }
      >
        <option className="text-black" value="all">
          All priorities
        </option>
        <option className="text-black" value="high">
          High
        </option>
        <option className="text-black" value="medium">
          Medium
        </option>
        <option className="text-black" value="low">
          Low
        </option>
      </select>
      <select
        className="input border rounded-md px-3 py-2"
        value={sort}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onSort(e.target.value as Props["sort"])
        }
      >
        <option className="text-black" value="createdAt">
          Created
        </option>
        <option className="text-black" value="dueDate">
          Due
        </option>
        <option className="text-black" value="priority">
          Priority
        </option>
      </select>
    </div>
  );
}

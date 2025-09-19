// app/app/todos/[id]/page.tsx
"use client";
import TodoDetailsFeature from "@/features/todos/TodoDetailsFeature";
import { useParams } from "next/navigation";

export default function SingleTodoPage() {
  const { id } = useParams<{ id: string }>();
  return <TodoDetailsFeature id={id} />;
}

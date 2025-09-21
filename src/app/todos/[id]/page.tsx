import TodoDetailsFeature from "@/features/todos/TodoDetailsFeature";

export default async function TodoDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TodoDetailsFeature id={id} />;
}

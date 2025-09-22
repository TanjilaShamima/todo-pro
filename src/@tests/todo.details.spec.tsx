import TodoDetailsFeature from "@/features/todos/TodoDetailsFeature";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/@store/services/todoApi", () => ({
  useGetTodoQuery: (id: string) => ({
    data: {
      id,
      title: "Test",
      description: "Desc",
      status: "todo",
      createdAt: new Date().toISOString(),
    },
    isLoading: false,
    isError: false,
  }),
}));

test("todo details renders title and description", () => {
  render(<TodoDetailsFeature id="123" />);
  expect(screen.getByText("Test")).toBeInTheDocument();
  expect(screen.getByText("Desc")).toBeInTheDocument();
});

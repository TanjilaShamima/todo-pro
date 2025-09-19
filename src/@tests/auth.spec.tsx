// src/tests/auth.spec.tsx
import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import userEvent from "@testing-library/user-event";

test("shows validation errors", async () => {
  render(<LoginPage />);
  await userEvent.click(screen.getByRole("button", { name: /login/i }));
  expect(await screen.findAllByText(/required|invalid/i)).toBeTruthy();
});

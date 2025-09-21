// src/tests/auth.spec.tsx
import { store } from "@/@store";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import LoginPage from "../../src/app/login/page";

test("shows validation errors", async () => {
  render(
    <Provider store={store}>
      <LoginPage />
    </Provider>
  );
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
  expect(await screen.findAllByText(/required|invalid/i)).toBeTruthy();
});

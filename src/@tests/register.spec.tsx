import { store } from "@/@store";
import RegisterPage from "@/app/register/page";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

test("register shows validation errors", async () => {
  render(
    <Provider store={store}>
      <RegisterPage />
    </Provider>
  );
  await userEvent.click(
    screen.getByRole("button", { name: /create account/i })
  );
  // Expect at least one validation error message to appear
  expect(await screen.findAllByText(/required|invalid|min/i)).toBeTruthy();
});

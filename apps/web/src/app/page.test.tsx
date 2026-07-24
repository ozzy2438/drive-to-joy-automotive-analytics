import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("describes the analytics test surface without a sales claim", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /research a fictional vehicle/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore vehicle range/i }),
    ).toHaveAttribute("href", "/vehicles");
  });
});

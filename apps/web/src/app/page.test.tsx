import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { TrackingProvider } from "@/lib/tracking/tracking-context";

describe("HomePage", () => {
  it("describes the analytics test surface without a sales claim", () => {
    render(
      <TrackingProvider>
        <HomePage />
      </TrackingProvider>,
    );

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

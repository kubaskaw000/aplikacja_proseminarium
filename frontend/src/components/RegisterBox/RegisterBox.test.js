import { render, screen } from "@testing-library/react";
import RegisterBox from "./RegisterBox";

test("renders learn react link", () => {
  render(<RegisterBox />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

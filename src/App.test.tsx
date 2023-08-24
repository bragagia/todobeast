import { render } from "@testing-library/react";
import InAppLayout from "./App";

test("renders learn react link", () => {
  render(<InAppLayout />);
  /*const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();*/
});

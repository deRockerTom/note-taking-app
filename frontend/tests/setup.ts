// import { vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

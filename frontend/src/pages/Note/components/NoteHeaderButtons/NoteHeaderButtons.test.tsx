import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import NoteHeaderButtons from "./NoteHeaderButtons";

vi.mock("@components/DeleteNote/DeleteNote", () => ({
  __esModule: true,
  default: () => <div data-testid="delete-note">Delete Note</div>,
}));

vi.mock("@components/VersionControl/VersionControl", () => ({
  __esModule: true,
  default: () => <div data-testid="version-control">Version Control</div>,
}));

vi.mock("@components/SVGButton/SVGButton", () => ({
  __esModule: true,
  default: () => <div data-testid="svg-button">SVG Button</div>,
}));

describe("NoteHeaderButtons", () => {
  const defaultProps = {
    noteId: "note-123",
    isLastVersion: true,
    showDiff: false,
    onDeleteNoteClick: vi.fn(),
    onVersionControlClick: vi.fn(),
    onDiffClick: vi.fn(),
  };

  it("renders DeleteNote when isLastVersion is true", () => {
    render(<NoteHeaderButtons {...defaultProps} />);

    expect(screen.getByTestId("delete-note")).toBeInTheDocument();
  });

  it("does not render DeleteNote when isLastVersion is false", () => {
    const props = { ...defaultProps, isLastVersion: false };
    render(<NoteHeaderButtons {...props} />);

    expect(screen.queryByTestId("delete-note")).not.toBeInTheDocument();
  });
});

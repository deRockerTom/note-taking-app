import { render, screen, fireEvent } from "@testing-library/react";
import NoteHeader from "./NoteHeader";
import { vi } from "vitest";

vi.mock("react-diff-viewer-continued", () => ({
  __esModule: true,
  default: ({ oldValue, newValue }: { oldValue: string; newValue: string }) => (
    <div data-testid="diff-viewer">
      Diff: {oldValue} - {newValue}
    </div>
  ),
}));

describe("NoteContent", () => {
  const mockOnTitleChange = vi.fn();

  const defaultProps = {
    title: "Current title",
    oldTitle: "Previous title",
    isLastVersion: true,
    showDiff: false,
    onTitleChange: mockOnTitleChange,
  };

  it("renders title in textarea when showDiff is false and isLastVersion is true", () => {
    render(<NoteHeader {...defaultProps} />);

    const textarea = screen.getByTestId("note-header-textarea");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue(defaultProps.title);
    expect(textarea).not.toHaveAttribute("readonly");
  });

  it("renders old title in textarea if not last version", () => {
    const props = { ...defaultProps, isLastVersion: false };
    render(<NoteHeader {...props} />);

    const textarea = screen.getByTestId("note-header-textarea");
    expect(textarea).toHaveValue(defaultProps.oldTitle);
    expect(textarea).toHaveAttribute("readonly");
  });

  it("calls onTitleChange when content is changed", () => {
    render(<NoteHeader {...defaultProps} />);

    const textarea = screen.getByTestId("note-header-textarea");
    fireEvent.change(textarea, { target: { value: "New title" } });
    expect(mockOnTitleChange).toHaveBeenCalled();
  });

  it("renders DiffViewer when showDiff is true", () => {
    const props = { ...defaultProps, showDiff: true };
    render(<NoteHeader {...props} />);

    const diff = screen.getByTestId("diff-viewer");
    expect(diff).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import NoteContent from "./NoteContent";
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
  const mockOnContentChange = vi.fn();

  const defaultProps = {
    content: "Current content",
    oldContent: "Previous content",
    isLastVersion: true,
    showDiff: false,
    onContentChange: mockOnContentChange,
  };

  it("renders content in textarea when showDiff is false and isLastVersion is true", () => {
    render(<NoteContent {...defaultProps} />);

    const textarea = screen.getByTestId("note-content-textarea");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue(defaultProps.content);
    expect(textarea).not.toHaveAttribute("readonly");
  });

  it("renders old content in textarea if not last version", () => {
    const props = { ...defaultProps, isLastVersion: false };
    render(<NoteContent {...props} />);

    const textarea = screen.getByTestId("note-content-textarea");
    expect(textarea).toHaveValue(defaultProps.oldContent);
    expect(textarea).toHaveAttribute("readonly");
  });

  it("calls onContentChange when content is changed", () => {
    render(<NoteContent {...defaultProps} />);

    const textarea = screen.getByTestId("note-content-textarea");
    fireEvent.change(textarea, { target: { value: "New content" } });
    expect(mockOnContentChange).toHaveBeenCalled();
  });

  it("renders DiffViewer when showDiff is true", () => {
    const props = { ...defaultProps, showDiff: true };
    render(<NoteContent {...props} />);

    const diff = screen.getByTestId("diff-viewer");
    expect(diff).toBeInTheDocument();
  });
});

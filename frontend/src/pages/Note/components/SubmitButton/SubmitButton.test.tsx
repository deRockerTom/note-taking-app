import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import SubmitButton from "./SubmitButton";

vi.mock("../SaveNote/SaveNote", () => ({
  __esModule: true,
  default: () => <div data-testid="save-note-button">Save Note</div>,
}));

describe("SubmitButton", () => {
  const mockOnRevertToVersion = vi.fn();
  const defaultProps = {
    noteId: "note-123",
    content: "Sample content",
    title: "Sample title",
    isLastVersion: true,
    onRevertToVersion: mockOnRevertToVersion,
    onSaveNoteClick: vi.fn(),
    isSaveDisabled: false,
  };
  it("renders SaveNote when isLastVersion is true", () => {
    render(<SubmitButton {...defaultProps} />);

    const saveNoteButton = screen.getByTestId("save-note-button");
    expect(saveNoteButton).toBeInTheDocument();
  });

  it("renders revert button when isLastVersion is false", () => {
    const props = { ...defaultProps, isLastVersion: false };
    render(<SubmitButton {...props} />);

    const revertButton = screen.getByTestId("revert-to-version-button");
    expect(revertButton).toBeInTheDocument();
  });
  it("calls onRevertToVersion when revert button is clicked", () => {
    const props = { ...defaultProps, isLastVersion: false };
    render(<SubmitButton {...props} />);

    const revertButton = screen.getByTestId("revert-to-version-button");
    revertButton.click();

    expect(mockOnRevertToVersion).toHaveBeenCalled();
  });
});

import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SaveNote from "./SaveNote";
import * as client from "@client";

vi.mock("@client", async () => {
  const actual = await vi.importActual<typeof import("@client")>("@client");
  return {
    ...actual,
    updateOneNoteApiV1NotesNoteIdPut: vi.fn(),
  };
});

const mockRefreshNoteList = vi.fn();

vi.mock("@components/Layout.helpers", async () => {
  const actual = await vi.importActual<
    typeof import("@components/Layout.helpers")
  >("@components/Layout.helpers");
  return {
    ...actual,
    useLayoutContext: () => ({
      refreshNoteList: mockRefreshNoteList,
    }),
  };
});

describe("SaveNote", () => {
  const mockOnSave = vi.fn();
  const defaultProps = {
    noteId: "note-123",
    content: "Sample content",
    title: "Sample title",
    onSave: mockOnSave,
  };
  it("renders SaveNote button", () => {
    render(<SaveNote {...defaultProps} />);

    const button = screen.getByTestId("save-note-button");
    expect(button).toBeInTheDocument();
  });

  it("calls onSave when the button is clicked", async () => {
    render(<SaveNote {...defaultProps} />);

    const fakeNote = {
      note_id: "note-123",
      date: "2023-10-01",
      title: "Sample title",
      content: "Sample content",
      version: 1,
    };

    vi.mocked(client.updateOneNoteApiV1NotesNoteIdPut).mockResolvedValue({
      data: fakeNote,
      request: {} as Request,
      response: {} as Response,
    });

    const button = screen.getByTestId("save-note-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    });
    expect(mockRefreshNoteList).toHaveBeenCalled();
    expect(client.updateOneNoteApiV1NotesNoteIdPut).toHaveBeenCalled();
  });

  it("disables the button when disabled prop is true", () => {
    const props = { ...defaultProps, disabled: true };
    render(<SaveNote {...props} />);

    const button = screen.getByTestId("save-note-button");
    expect(button).toBeDisabled();
  });
});

import { renderHook, waitFor } from "@testing-library/react";

import { MemoryRouter, useNavigate } from "react-router-dom";
import useNote from "./useNote";
import * as client from "@client";
import { vi } from "vitest";
import { act, ChangeEvent } from "react";

const mockRequest = {} as Request;
const mockResponse = {} as Response;

vi.mock("@client", async () => {
  const actual = await vi.importActual<typeof import("@client")>("@client");
  return {
    ...actual,
    getOneNoteApiV1NotesNoteIdGet: vi.fn(),
    getNoteVersionsApiV1NotesNoteIdVersionsGet: vi.fn(),
    rollbackOneNoteApiV1NotesNoteIdRollbackPost: vi.fn(),
    getOneNoteWithVersionApiV1NotesNoteIdVersionsVersionGet: vi.fn(),
  };
});

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("useNote", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it("fetches note and versions on mount", async () => {
    const fakeNote = {
      note_id: "123",
      date: "2023-10-01",
      title: "Test",
      content: "Note content",
      version: 1,
    };
    const fakeVersions = {
      notes: [
        { version: 1, note_id: "123", date: "2023-10-01" },
        { version: 0, note_id: "123", date: "2023-09-30" },
      ],
    };

    vi.mocked(client.getOneNoteApiV1NotesNoteIdGet).mockResolvedValue({
      data: fakeNote,
      request: mockRequest,
      response: mockResponse,
    });
    vi.mocked(
      client.getNoteVersionsApiV1NotesNoteIdVersionsGet,
    ).mockResolvedValue({
      data: fakeVersions,
      request: mockRequest,
      response: mockResponse,
    });

    const { result } = renderHook(() => useNote({ noteId: "123" }), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    await waitFor(() => {
      expect(result.current.title).toBe("Test");
    });

    expect(result.current.title).toBe("Test");
    expect(result.current.content).toBe("Note content");
    expect(result.current.versions).toEqual(fakeVersions.notes);
    expect(result.current.selectedVersion).toBe(1);
    expect(result.current.isLastVersion).toBe(true);
  });

  it("navigates to home on note get fetch error", async () => {
    vi.mocked(client.getOneNoteApiV1NotesNoteIdGet).mockRejectedValue(
      new Error("fail"),
    );

    renderHook(() => useNote({ noteId: "123" }), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to home on note versions get fetch error", async () => {
    vi.mocked(
      client.getNoteVersionsApiV1NotesNoteIdVersionsGet,
    ).mockRejectedValue(new Error("fail"));

    renderHook(() => useNote({ noteId: "123" }), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("toggles version control visibility", () => {
    const { result } = renderHook(() => useNote({ noteId: "123" }), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(result.current.isVersionControlVisible).toBe(false);

    act(() => {
      result.current.handleVersionControlClick();
    });

    expect(result.current.isVersionControlVisible).toBe(true);
  });

  it("handles title and content changes", () => {
    const { result } = renderHook(() => useNote({ noteId: "123" }), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(result.current.title).toBe("");
    expect(result.current.content).toBe("");

    act(() => {
      result.current.handleTitleChange({
        target: { value: "New Title" },
      } as ChangeEvent<HTMLTextAreaElement>);
      result.current.handleContentChange({
        target: { value: "New Content" },
      } as ChangeEvent<HTMLTextAreaElement>);
    });

    expect(result.current.title).toBe("New Title");
    expect(result.current.content).toBe("New Content");
  });

  it("handles version click", async () => {
    const { result } = renderHook(() => useNote({ noteId: "123" }), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    const fakeNote = {
      note_id: "123",
      date: "2023-10-01",
      title: "Test",
      content: "Note content",
      version: 1,
    };

    vi.mocked(
      client.getOneNoteWithVersionApiV1NotesNoteIdVersionsVersionGet,
    ).mockResolvedValue({
      data: fakeNote,
      request: mockRequest,
      response: mockResponse,
    });

    act(() => {
      result.current.handleVersionClick({
        version: 1,
        note_id: "123",
        date: "2023-10-01",
      });
    });

    expect(
      client.getOneNoteWithVersionApiV1NotesNoteIdVersionsVersionGet,
    ).toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.selectedVersion).toBe(1);
    });

    expect(result.current.remoteNote).toEqual(fakeNote);
  });

  it("handles revert to version click", async () => {
    const { result } = renderHook(() => useNote({ noteId: "123" }), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    const fakeNote = {
      note_id: "123",
      date: "2023-10-01",
      title: "Test",
      content: "Note content",
      version: 1,
    };

    const fakeResponse = {
      message: "Note reverted successfully",
    };

    vi.mocked(
      client.rollbackOneNoteApiV1NotesNoteIdRollbackPost,
    ).mockResolvedValue({
      data: fakeResponse,
      request: mockRequest,
      response: mockResponse,
    });

    vi.mocked(client.getOneNoteApiV1NotesNoteIdGet).mockResolvedValue({
      data: fakeNote,
      request: mockRequest,
      response: mockResponse,
    });

    // Mock the confirmation dialog
    window.confirm = vi.fn(() => true);

    act(() => {
      result.current.handleRevertToVersionClick(1);
    });

    expect(
      client.rollbackOneNoteApiV1NotesNoteIdRollbackPost,
    ).toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.remoteNote).toEqual(fakeNote);
    });
  });

  it("handles show diff", () => {
    const { result } = renderHook(() => useNote({ noteId: "123" }), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(result.current.showDiff).toBe(false);

    act(() => {
      result.current.handleSetShowDiff();
    });

    expect(result.current.showDiff).toBe(true);
  });
});

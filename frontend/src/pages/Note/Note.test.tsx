import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Note from "./Note";

// Mocks
vi.mock("@hooks/useRequiredParam", () => ({
  useRequiredParam: () => "note-123",
}));

vi.mock("@components/Layout.helpers", () => ({
  useLayoutContext: () => ({
    handleDeleteNote: vi.fn(),
  }),
}));

vi.mock("react-router-dom", (mod) => {
  const actual = mod;
  return {
    ...actual,
    unstable_usePrompt: vi.fn(), // just stub it, since we aren't testing navigation
  };
});

vi.mock("./hooks/useNote", () => ({
  default: () => ({
    remoteNote: { title: "Remote Title", content: "Remote Content" },
    isVersionControlVisible: true,
    selectedVersion: { id: "v1" },
    title: "Local Title",
    content: "Local Content",
    versions: [{ id: "v1", title: "Version 1" }],
    byPassPromptOnChangeRef: { current: false },
    isLastVersion: true,
    showDiff: false,
    handleContentChange: vi.fn(),
    handleTitleChange: vi.fn(),
    handleVersionControlClick: vi.fn(),
    handleVersionClick: vi.fn(),
    handleRevertToVersionClick: vi.fn(),
    handleSetShowDiff: vi.fn(),
    refreshLastRemoteNote: vi.fn(),
  }),
}));

// Mock child components so we don't test them here
vi.mock("./components/NotePage", () => ({
  default: () => <div data-testid="NotePage">NotePage</div>,
}));

vi.mock("./components/VersionSidebar", () => ({
  default: () => <div data-testid="VersionSidebar">VersionSidebar</div>,
}));

describe("Note", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders NotePage and VersionSidebar when remoteNote exists", () => {
    render(<Note />);
    expect(screen.getByTestId("NotePage")).toBeInTheDocument();
    expect(screen.getByTestId("VersionSidebar")).toBeInTheDocument();
  });

  it("renders nothing when remoteNote does not exist", async () => {
    vi.resetModules(); // Clear previous modules
    vi.doMock("./hooks/useNote", () => ({
      default: () => ({
        remoteNote: null,
        isVersionControlVisible: false,
        selectedVersion: null,
        title: "",
        content: "",
        versions: [],
        byPassPromptOnChangeRef: { current: false },
        isLastVersion: false,
        showDiff: false,
        handleContentChange: vi.fn(),
        handleTitleChange: vi.fn(),
        handleVersionControlClick: vi.fn(),
        handleVersionClick: vi.fn(),
        handleRevertToVersionClick: vi.fn(),
        handleSetShowDiff: vi.fn(),
        refreshLastRemoteNote: vi.fn(),
      }),
    }));

    const { default: Note } = await import("./Note");
    const { container } = render(<Note />);

    expect(container.querySelector(".note")).toBeInTheDocument();
    expect(screen.queryByTestId("NotePage")).not.toBeInTheDocument();
    expect(screen.queryByTestId("VersionSidebar")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import VersionSidebar from "./VersionSidebar";

describe("VersionSidebar", () => {
  const mockOnVersionSelect = vi.fn();
  const defaultProps = {
    versions: [
      { version: 1, date: "2023-10-01", note_id: "note-123" },
      { version: 0, date: "2023-09-30", note_id: "note-123" },
    ],
    selectedVersion: 1,
    isVersionControlVisible: true,
    onVersionSelect: mockOnVersionSelect,
  };
  it("renders correctly with isVersionControlVisible", () => {
    render(<VersionSidebar {...defaultProps} />);
    expect(screen.getByTestId("version-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("version-sidebar-title")).toBeInTheDocument();
    expect(screen.getByTestId("version-sidebar-list")).toBeInTheDocument();
  });

  it("renders nothing when isVersionControlVisible is false", () => {
    const props = { ...defaultProps, isVersionControlVisible: false };
    render(<VersionSidebar {...props} />);
    expect(screen.queryByTestId("version-sidebar")).toBeInTheDocument();
    expect(
      screen.queryByTestId("version-sidebar-title"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("version-sidebar-list"),
    ).not.toBeInTheDocument();
  });

  it("calls onVersionSelect when a version is clicked", () => {
    render(<VersionSidebar {...defaultProps} />);
    const versionItem = screen.getByTestId("version-item-1");
    versionItem.click();
    expect(mockOnVersionSelect).toHaveBeenCalledWith(defaultProps.versions[0]);
  });
});

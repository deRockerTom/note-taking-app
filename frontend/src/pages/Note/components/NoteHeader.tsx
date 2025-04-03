import DiffViewer from "react-diff-viewer-continued";
import { diffStyleOptions } from "./diffViewerOptions";
import "./NoteHeader.scss";

interface NoteHeaderProps {
  title: string;
  oldTitle: string;
  isLastVersion: boolean;
  showDiff: boolean;
  onTitleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function NoteHeader({
  title,
  oldTitle,
  isLastVersion,
  showDiff,
  onTitleChange,
}: NoteHeaderProps) {
  return showDiff ? (
    <DiffViewer
      oldValue={oldTitle}
      newValue={title}
      splitView={false}
      hideLineNumbers={true}
      showDiffOnly={false}
      styles={diffStyleOptions}
    />
  ) : isLastVersion ? (
    <textarea
      value={title}
      onChange={onTitleChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      className="note-header__last-version"
      placeholder="Note Title"
    />
  ) : (
    <DiffViewer
      oldValue={oldTitle}
      newValue={title}
      splitView={false}
      hideLineNumbers={true}
      showDiffOnly={false}
      styles={diffStyleOptions}
    />
  );
}

export default NoteHeader;

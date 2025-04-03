import DiffViewer from "react-diff-viewer-continued";
import { diffStyleOptions } from "./diffViewerOptions";
import "./NoteHeader.scss";

interface NoteHeaderProps {
  title: string;
  oldTitle: string;
  isLastVersion: boolean;
  onTitleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function NoteHeader({
  title,
  oldTitle,
  isLastVersion,
  onTitleChange,
}: NoteHeaderProps) {
  return isLastVersion ? (
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

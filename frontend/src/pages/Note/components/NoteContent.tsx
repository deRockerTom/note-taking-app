import DiffViewer from "react-diff-viewer-continued";
import { diffStyleOptions } from "./diffViewerOptions";
import "./NoteContent.scss";

interface NoteContentProps {
  content: string;
  oldContent: string;
  isLastVersion: boolean;
  showDiff: boolean;
  onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function NoteContent({
  content,
  oldContent,
  isLastVersion,
  showDiff,
  onContentChange,
}: NoteContentProps) {
  return (
    <div className="note-content">
      {showDiff ? (
        <DiffViewer
          oldValue={oldContent}
          newValue={content}
          splitView={false}
          hideLineNumbers={true}
          showDiffOnly={false}
          styles={diffStyleOptions}
        />
      ) : isLastVersion ? (
        <textarea
          value={content}
          onChange={onContentChange}
          className="note-content__content"
          placeholder="Note Content"
        />
      ) : (
        <DiffViewer
          oldValue={oldContent}
          newValue={content}
          splitView={false}
          hideLineNumbers={true}
          showDiffOnly={false}
          styles={diffStyleOptions}
        />
      )}
    </div>
  );
  return (
    <div className="note-content">
      {isLastVersion ? (
        <textarea
          value={content}
          onChange={onContentChange}
          className="note-content__content"
          placeholder="Note Content"
        />
      ) : (
        <DiffViewer
          oldValue={oldContent}
          newValue={content}
          splitView={false}
          hideLineNumbers={true}
          showDiffOnly={false}
          styles={diffStyleOptions}
        />
      )}
    </div>
  );
}

export default NoteContent;

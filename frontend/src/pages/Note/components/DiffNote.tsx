import DiffViewer, {
  ReactDiffViewerStylesOverride,
} from "react-diff-viewer-continued";
import VersionControlButton from "./VersionControlButton";

import "./DiffNote.scss";

interface DiffNoteProps {
  oldTitle: string;
  title: string;
  oldContent: string;
  content: string;
  onVersionControlClick: () => void;
  onRevertToVersion: () => void;
}

const diffStyleOptions: ReactDiffViewerStylesOverride = {
  // @ts-expect-error - This is an issue with the types of react-diff-viewer-continued
  summary: {
    display: "none",
  },
  diffContainer: {
    minWidth: 0,
  },
};

function DiffNote({
  oldTitle,
  title,
  oldContent,
  content,
  onVersionControlClick,
  onRevertToVersion,
}: DiffNoteProps) {
  return (
    <div className="diff-note">
      <div className="diff-note__header">
        <span className="diff-note__header__title">
          <DiffViewer
            oldValue={oldTitle}
            newValue={title}
            splitView={false}
            hideLineNumbers={true}
            showDiffOnly={false}
            styles={diffStyleOptions}
          />
        </span>
        <VersionControlButton onClick={onVersionControlClick} />
      </div>
      <span className="diff-note__content">
        <DiffViewer
          oldValue={oldContent}
          newValue={content}
          splitView={false}
          hideLineNumbers={true}
          showDiffOnly={false}
          styles={diffStyleOptions}
        />
      </span>
      <button
        className="diff-note__revert-button"
        onClick={onRevertToVersion}
        type="button"
      >
        Revert to Version
      </button>
    </div>
  );
}

export default DiffNote;

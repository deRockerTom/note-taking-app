import DeleteNote from "@components/DeleteNote/DeleteNote";
import VersionControlButton from "./VersionControlButton";
import SVGButton from "@components/SVGButton/SVGButton";
import DiffIcon from "@assets/Diff.svg?react";
import "./NoteHeaderButtons.scss";

interface NoteHeaderButtonsProps {
  noteId: string;
  isLastVersion: boolean;
  showDiff: boolean;
  onDeleteNoteClick: () => void;
  onVersionControlClick: () => void;
  onDiffClick: () => void;
}

function NoteHeaderButtons({
  noteId,
  isLastVersion,
  showDiff,
  onDeleteNoteClick,
  onVersionControlClick,
  onDiffClick,
}: NoteHeaderButtonsProps) {
  return (
    <div className="note-header-buttons">
      {isLastVersion && (
        <DeleteNote
          noteId={noteId}
          className="note-header-buttons__trash-can"
          onDelete={onDeleteNoteClick}
        />
      )}
      <SVGButton
        classNames={[
          "note-header-buttons__diff",
          showDiff
            ? "note-header-buttons__diff--active"
            : "note-header-buttons__diff--inactive",
        ]}
        onClick={onDiffClick}
        SVGIcon={DiffIcon}
        tooltipContent={showDiff ? "Hide diff" : "Show diff"}
      />
      <VersionControlButton onClick={onVersionControlClick} />
    </div>
  );
}

export default NoteHeaderButtons;

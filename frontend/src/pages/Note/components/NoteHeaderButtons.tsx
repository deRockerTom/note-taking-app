import DeleteNote from "@components/DeleteNote/DeleteNote";
import VersionControlButton from "./VersionControlButton";
import SVGButton from "@components/SVGButton/SVGButton";
import DiffIcon from "@assets/Diff.svg?react";
import "./NoteHeaderButtons.scss";

interface NoteHeaderButtonsProps {
  noteId: string;
  isLastVersion: boolean;
  onDeleteNoteClick: () => void;
  onVersionControlClick: () => void;
}

function NoteHeaderButtons({
  noteId,
  isLastVersion,
  onDeleteNoteClick,
  onVersionControlClick,
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
        classNames={["note-header-buttons__diff"]}
        onClick={() => {}}
        SVGIcon={DiffIcon}
      />
      <VersionControlButton onClick={onVersionControlClick} />
    </div>
  );
}

export default NoteHeaderButtons;

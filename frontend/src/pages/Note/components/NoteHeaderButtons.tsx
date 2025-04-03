import DeleteNote from "@components/DeleteNote/DeleteNote";
import VersionControlButton from "./VersionControlButton";
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
      <VersionControlButton onClick={onVersionControlClick} />
    </div>
  );
}

export default NoteHeaderButtons;

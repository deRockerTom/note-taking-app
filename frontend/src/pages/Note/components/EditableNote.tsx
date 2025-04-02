import DeleteNote from "@components/DeleteNote/DeleteNote";
import VersionControlButton from "./VersionControlButton";
import SaveNote from "./SaveNote";
import "./EditableNote.scss";

interface EditableNoteProps {
  noteId: string;
  title: string;
  content: string;
  isSaveDisabled: boolean;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDeleteNoteClick: () => void;
  onVersionControlClick: () => void;
  onSaveNoteClick: () => void;
}

function EditableNote({
  noteId,
  title,
  content,
  isSaveDisabled,
  onTitleChange,
  onContentChange,
  onDeleteNoteClick,
  onVersionControlClick,
  onSaveNoteClick,
}: EditableNoteProps) {
  return (
    <div className="editable-note">
      <div className="editable-note__header">
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          className="editable-note__header__title"
          placeholder="Note Title"
        />
        <VersionControlButton onClick={onVersionControlClick} />
        <DeleteNote
          noteId={noteId}
          className="editable-note__header__trash-can"
          onDelete={onDeleteNoteClick}
        />
      </div>
      <textarea
        value={content}
        onChange={onContentChange}
        className="editable-note__content"
        placeholder="Note Content"
      />
      <SaveNote
        noteId={noteId}
        content={content}
        title={title}
        onSave={onSaveNoteClick}
        disabled={isSaveDisabled}
      />
    </div>
  );
}

export default EditableNote;

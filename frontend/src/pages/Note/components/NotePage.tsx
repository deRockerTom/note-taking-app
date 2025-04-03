import { Note } from "@client";
import SaveNote from "./SaveNote";
import NoteHeader from "./NoteHeader";
import NoteHeaderButtons from "./NoteHeaderButtons";
import NoteContent from "./NoteContent";
import "./NotePage.scss";

interface NotePageProps {
  noteId: string;
  title: string;
  content: string;
  isSaveDisabled: boolean;
  isLastVersion: boolean;
  remoteNote: Note;
  onTitleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDeleteNoteClick: () => void;
  onVersionControlClick: () => void;
  onSaveNoteClick: () => void;
  onRevertToVersion: () => void;
}

function NotePage({
  noteId,
  title,
  content,
  isSaveDisabled,
  isLastVersion,
  remoteNote,
  onTitleChange,
  onContentChange,
  onDeleteNoteClick,
  onVersionControlClick,
  onSaveNoteClick,
}: NotePageProps) {
  return (
    <div className="note-page">
      <div className="note-page__header">
        <div className="note-page__header__title">
          <NoteHeader
            title={title}
            oldTitle={remoteNote.title}
            isLastVersion={isLastVersion}
            onTitleChange={onTitleChange}
          />
        </div>
        <NoteHeaderButtons
          noteId={noteId}
          isLastVersion={isLastVersion}
          onDeleteNoteClick={onDeleteNoteClick}
          onVersionControlClick={onVersionControlClick}
        />
      </div>
      <NoteContent
        content={content}
        oldContent={remoteNote.content}
        isLastVersion={isLastVersion}
        onContentChange={onContentChange}
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

export default NotePage;

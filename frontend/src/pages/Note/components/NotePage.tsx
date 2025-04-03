import { Note } from "@client";
import NoteHeader from "./NoteHeader";
import NoteHeaderButtons from "./NoteHeaderButtons";
import NoteContent from "./NoteContent";
import SubmitButton from "./SubmitButton";
import "./NotePage.scss";

interface NotePageProps {
  noteId: string;
  title: string;
  content: string;
  isSaveDisabled: boolean;
  isLastVersion: boolean;
  remoteNote: Note;
  showDiff: boolean;
  onTitleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDeleteNoteClick: () => void;
  onVersionControlClick: () => void;
  onSaveNoteClick: () => void;
  onRevertToVersion: () => void;
  onDiffClick: () => void;
}

function NotePage({
  noteId,
  title,
  content,
  isSaveDisabled,
  isLastVersion,
  remoteNote,
  showDiff,
  onTitleChange,
  onContentChange,
  onDeleteNoteClick,
  onVersionControlClick,
  onSaveNoteClick,
  onRevertToVersion,
  onDiffClick,
}: NotePageProps) {
  return (
    <div className="note-page">
      <div className="note-page__header">
        <div className="note-page__header__title">
          <NoteHeader
            title={title}
            oldTitle={remoteNote.title}
            isLastVersion={isLastVersion}
            showDiff={showDiff}
            onTitleChange={onTitleChange}
          />
        </div>
        <NoteHeaderButtons
          noteId={noteId}
          isLastVersion={isLastVersion}
          showDiff={showDiff}
          onDeleteNoteClick={onDeleteNoteClick}
          onVersionControlClick={onVersionControlClick}
          onDiffClick={onDiffClick}
        />
      </div>
      <NoteContent
        content={content}
        oldContent={remoteNote.content}
        isLastVersion={isLastVersion}
        showDiff={showDiff}
        onContentChange={onContentChange}
      />
      <SubmitButton
        noteId={noteId}
        content={content}
        title={title}
        isLastVersion={isLastVersion}
        onRevertToVersion={onRevertToVersion}
        onSaveNoteClick={onSaveNoteClick}
        isSaveDisabled={isSaveDisabled}
      />
    </div>
  );
}

export default NotePage;

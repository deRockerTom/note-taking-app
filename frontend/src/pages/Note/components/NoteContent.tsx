import { Note } from "@client";
import DiffNote from "./DiffNote";
import EditableNote from "./EditableNote";

interface NoteContentProps {
  noteId: string;
  title: string;
  content: string;
  isSaveDisabled: boolean;
  isLastVersion: boolean;
  remoteNote: Note;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDeleteNoteClick: () => void;
  onVersionControlClick: () => void;
  onSaveNoteClick: () => void;
  onRevertToVersion: () => void;
}

function NoteContent({
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
  onRevertToVersion,
}: NoteContentProps) {
  return isLastVersion
    ? EditableNote({
        noteId,
        title,
        content,
        isSaveDisabled,
        onTitleChange,
        onContentChange,
        onDeleteNoteClick,
        onVersionControlClick,
        onSaveNoteClick,
      })
    : DiffNote({
        oldTitle: remoteNote.title,
        title: title,
        oldContent: remoteNote.content,
        content: content,
        onVersionControlClick,
        onRevertToVersion,
      });
}

export default NoteContent;

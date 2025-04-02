import { updateOneNoteApiV1NotesNoteIdPut } from "@client";
import { useLayoutContext } from "@components/Layout.helpers";
import { backendFetchClient } from "@shared/fetchClient";

import "./SaveNote.scss";

interface SaveNoteProps {
  content: string;
  disabled?: boolean;
  noteId: string;
  title: string;
  onSave: () => void;
}

function SaveNote({ noteId, disabled, title, content, onSave }: SaveNoteProps) {
  const { refreshNoteList } = useLayoutContext();

  const handleSaveNote = () => {
    // Logic to save the note goes here
    console.log("Saving note:", { noteId, title, content });
    updateOneNoteApiV1NotesNoteIdPut({
      client: backendFetchClient,
      body: {
        content,
        title,
      },
      path: {
        note_id: noteId,
      },
    })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error saving note:", error);
          return;
        }
        if (data) {
          refreshNoteList();
          onSave();
        }
      })
      .catch((error) => {
        console.error("Error saving note:", error);
      });
  };

  return (
    <button
      className="save-note"
      onClick={handleSaveNote}
      type="submit"
      disabled={disabled}
    >
      Save
    </button>
  );
}

export default SaveNote;

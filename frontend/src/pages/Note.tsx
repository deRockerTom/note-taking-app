import { useEffect, useState } from "react";
import { getOneNoteApiV1NotesNoteIdGet, Note as NoteType } from "../client";
import { backendFetchClient } from "../shared/fetchClient";
import { useRequiredParam } from "../hooks/useRequiredParam";
import "./Note.scss";
import { unstable_usePrompt } from "react-router-dom";

function Note() {
  const noteId = useRequiredParam("noteId");
  // State to hold the current title and content
  const [_remoteNote, setRemoteNote] = useState<NoteType>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Update title and content
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
  };

  useEffect(() => {
    // Fetch the note from the backend
    getOneNoteApiV1NotesNoteIdGet({
      client: backendFetchClient,
      path: {
        note_id: noteId,
      },
    })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching note:", error);
          return;
        }
        if (data) {
          setRemoteNote(data);
          setTitle(data.title);
          setContent(data.content);
        }
      })
      .catch((error) => {
        console.error("Error fetching note:", error);
      });
  }, [noteId]);

  unstable_usePrompt({
    message:
      "Are you sure that you want to leave ? You have unsaved changes that will be lost if you leave.",
    when: () =>
      title !== _remoteNote?.title || content !== _remoteNote?.content,
  });

  return (
    <div className="note">
      {/* Editable title */}
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="note__title"
        placeholder="Note Title"
      />
      {/* Editable content */}
      <textarea
        value={content}
        onChange={handleContentChange}
        className="note__content"
        placeholder="Note Content"
      />
    </div>
  );
}

export default Note;

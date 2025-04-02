import { useEffect, useRef, useState } from "react";
import { getOneNoteApiV1NotesNoteIdGet, Note as NoteType } from "@client";
import { backendFetchClient } from "@shared/fetchClient";
import { useRequiredParam } from "@hooks/useRequiredParam";
import { unstable_usePrompt } from "react-router-dom";
import DeleteNote from "@components/DeleteNote/DeleteNote";
import { useLayoutContext } from "@components/Layout.helpers";
import SaveNote from "./components/SaveNote";
import VersionControlButton from "./components/VersionControlButton";
import "./Note.scss";

function Note() {
  const noteId = useRequiredParam("noteId");
  const { handleDeleteNote } = useLayoutContext();
  // State to hold the current title and content
  const [remoteNote, setRemoteNote] = useState<NoteType>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const isDeletingRef = useRef(false);

  const handleDeleteNoteClick = () => {
    isDeletingRef.current = true;
    handleDeleteNote(noteId);
  };

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
      !isDeletingRef.current &&
      (title !== remoteNote?.title || content !== remoteNote?.content),
  });

  return (
    <div className="note">
      <div className="note__header">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="note__header__title"
          placeholder="Note Title"
        />
        <VersionControlButton
          onClick={() => {
            console.log("Version Control Clicked");
          }}
        />
        <DeleteNote
          noteId={noteId}
          className="note__header__trash-can"
          onDelete={handleDeleteNoteClick}
        />
      </div>
      <textarea
        value={content}
        onChange={handleContentChange}
        className="note__content"
        placeholder="Note Content"
      />
      <SaveNote
        noteId={noteId}
        content={content}
        title={title}
        onSave={() => {
          // Here we assume that the note wasn't modified after in the backend
          // and we can just update the local state
          // We could also check the backend for the latest version of the note
          // instead
          setRemoteNote((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              title,
              content,
            };
          });
        }}
        disabled={
          title === remoteNote?.title && content === remoteNote?.content
        }
      />
    </div>
  );
}

export default Note;

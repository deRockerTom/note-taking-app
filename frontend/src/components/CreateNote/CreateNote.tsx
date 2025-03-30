import { useEffect, useState } from "react";
import { createOneNoteApiV1NotesPost } from "../../client";

import "./CreateNote.scss";
import { backendFetchClient } from "../../shared/fetchClient";
import { useNavigate } from "react-router-dom";

interface CreateNoteProps {
  onCreate: (title: string) => void;
}

function CreateNote({ onCreate }: CreateNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  // Handle the "Create" button click or pressing Enter
  const handleCreateNote = () => {
    if (title.trim()) {
      createOneNoteApiV1NotesPost({
        client: backendFetchClient,
        body: {
          title,
          content: "",
        },
      })
        .then(({ data, error }) => {
          if (error) {
            console.error("Error creating note:", error);
            return;
          }
          if (data) {
            setTitle("");
            setIsEditing(false);
            onCreate(title);
            navigate(`/${data.note_id}`)?.catch((error) => {
              console.error("Error navigating to new note:", error);
            });
          }
        })
        .catch((error) => {
          console.error("Error creating note:", error);
        });
    }
  };

  const handleCancel = () => {
    setTitle("");
    setIsEditing(false);
  };

  const handleBlur = () => {
    if (title.trim() === "") {
      handleCancel();
    }
  };

  // Close the input field if the user presses the Escape key or if no title is entered
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="create-note">
      {isEditing ? (
        <div className="create-note__input-container">
          <input
            className="create-note__input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateNote()}
            onBlur={handleBlur}
            autoFocus
          />
          <button
            className="create-note__button"
            onClick={handleCreateNote}
            type="submit"
          >
            Create
          </button>
        </div>
      ) : (
        <div
          className="create-note__fake-note"
          onClick={() => setIsEditing(true)}
        >
          <span className="create-note__icon">+</span> Create a new note
        </div>
      )}
    </div>
  );
}

export default CreateNote;

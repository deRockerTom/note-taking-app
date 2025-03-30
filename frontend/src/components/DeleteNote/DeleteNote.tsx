import classNames from "classnames";
import TrashCanIcon from "../../assets/TrashCan.svg?react";
import { deleteOneNoteApiV1NotesNoteIdDelete } from "../../client";
import { backendFetchClient } from "../../shared/fetchClient";
import "./DeleteNote.scss";

interface DeleteNoteProps {
  noteId: string;
  onDelete?: (noteId: string) => void;
  className?: string;
}

function DeleteNote({ noteId, onDelete, className }: DeleteNoteProps) {
  const handleDelete = () => {
    try {
      const confirmationResponse = confirm(
        "Are you sure you want to delete this note? This action cannot be undone.",
      );
      if (!confirmationResponse) {
        return;
      }
      deleteOneNoteApiV1NotesNoteIdDelete({
        client: backendFetchClient,
        path: {
          note_id: noteId,
        },
      })
        .then(({ data, error }) => {
          if (error) {
            console.error("Error deleting note:", error);
            return;
          }
          if (data) {
            if (onDelete) {
              onDelete(noteId);
            }
          }
        })
        .catch((error) => {
          console.error("Error deleting note:", error);
        });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <button
      className={classNames("delete-note", className)}
      onClick={handleDelete}
      title="Delete Note"
      type="button"
    >
      <TrashCanIcon className="delete-note__icon" />
    </button>
  );
}

export default DeleteNote;

import { Link } from "react-router-dom";
import { GetAllNotesResponse } from "@client";
import classNames from "classnames";
import DeleteNote from "@components/DeleteNote/DeleteNote";
import "./NoteList.scss";

interface NoteListProps {
  notes: GetAllNotesResponse[];
  activeNoteId?: string;
  onDelete?: (noteId: string) => void;
}

function NoteList({ notes, activeNoteId, onDelete }: NoteListProps) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <div
          key={note.note_id}
          className={classNames("note-list__item", {
            "note-list__item--active": activeNoteId === note.note_id,
          })}
        >
          <Link to={`/${note.note_id}`} className="note-list__item__link">
            <div className="note-list__item__link__title">{note.title}</div>
          </Link>
          <DeleteNote
            noteId={note.note_id}
            className="note-list__item__trash-can"
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

export default NoteList;

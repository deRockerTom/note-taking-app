import { Link } from "react-router-dom";
import { GetAllNotesResponse } from "../../client";
import "./NoteList.scss";
import classNames from "classnames";

interface NoteListProps {
  notes: GetAllNotesResponse[];
  activeNoteId?: string;
}

function NoteList({ notes, activeNoteId }: NoteListProps) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <Link key={note.note_id} to={`/${note.note_id}`}>
          <div
            className={classNames("note-list__item", {
              "note-list__item--active": activeNoteId === note.note_id,
            })}
          >
            {note.title}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default NoteList;

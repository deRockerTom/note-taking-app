import { Outlet, Link, useParams } from "react-router-dom";
import noteTakingAppLogo from "/note-taking-logo.svg";
import "./Layout.scss";
import NoteList from "./NoteList/NoteList";

const notes = [
  { note_id: "1", title: "First Note", date: "2023-10-02" },
  { note_id: "2", title: "Second Note", date: "2023-10-01" },
];

function Layout() {
  const { noteId } = useParams();
  return (
    <div className="layout">
      <div className="layout__sidebar">
        <Link to="/">
          <div className="layout__sidebar__link">
            <img
              src={noteTakingAppLogo}
              className="layout__sidebar__link__logo"
              alt="Note Taking App logo"
            />
          </div>
        </Link>
        <NoteList notes={notes} activeNoteId={noteId} />
      </div>

      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

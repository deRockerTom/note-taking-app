import { Outlet, Link, useParams } from "react-router-dom";
import noteTakingAppLogo from "/note-taking-logo.svg";
import "./Layout.scss";
import NoteList from "./NoteList/NoteList";
import { useEffect, useState } from "react";
import { GetAllNotesResponse, getNotesApiV1NotesGet } from "../client";
import { backendFetchClient } from "../shared/fetchClient";

function Layout() {
  const { noteId } = useParams();

  const [noteList, setNoteList] = useState<GetAllNotesResponse[]>([]);

  useEffect(() => {
    getNotesApiV1NotesGet({
      client: backendFetchClient,
    })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching notes:", error);
          return;
        }
        if (data) {
          setNoteList(data.notes);
        }
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  }, []);

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
        <NoteList notes={noteList} activeNoteId={noteId} />
      </div>

      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

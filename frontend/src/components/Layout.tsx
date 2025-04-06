import { Outlet, Link, useParams, useNavigate } from "react-router-dom";
import noteTakingAppLogo from "/note-taking-logo.svg";
import NoteList from "./NoteList/NoteList";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GetAllNotesResponse, getNotesApiV1NotesGet } from "@client";
import { backendFetchClient } from "@shared/fetchClient";
import CreateNote from "./CreateNote/CreateNote";
import { LayoutContext } from "./Layout.helpers";
import classNames from "classnames";
import "./Layout.scss";
import CustomTooltip from "./CustomTooltip/CustomTooltip";

function Layout() {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [noteList, setNoteList] = useState<GetAllNotesResponse[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const deletingNoteIds = useMemo(() => new Set<string>(), []);

  const refreshNoteList = useCallback(() => {
    getNotesApiV1NotesGet({
      client: backendFetchClient,
      throwOnError: true,
    })
      .then(({ data }) => {
        setNoteList(data.notes);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  }, []);

  const handleDeleteNote = useCallback(
    (noteIdToDelete: string) => {
      deletingNoteIds.add(noteIdToDelete);
      if (noteIdToDelete === noteId) {
        navigate("/")?.catch((error) => {
          console.error(
            "Error navigating to Home after deleting a note:",
            error,
          );
        });
      }
      refreshNoteList();
      deletingNoteIds.delete(noteIdToDelete);
    },
    [deletingNoteIds, noteId, refreshNoteList, navigate],
  );

  const outletContext = useMemo<LayoutContext>(
    () => ({
      deletingNoteIds,
      refreshNoteList,
      handleDeleteNote,
    }),
    [deletingNoteIds, refreshNoteList, handleDeleteNote],
  );

  useEffect(() => {
    refreshNoteList();
  }, [refreshNoteList]);

  return (
    <div className="layout">
      <div
        className={classNames("layout__sidebar", {
          "layout__sidebar--collapsed": isSidebarCollapsed,
        })}
      >
        <button
          className="layout__sidebar__toggle-btn"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          type="button"
        >
          {isSidebarCollapsed ? ">" : "<"}
        </button>
        {!isSidebarCollapsed && (
          <>
            <Link to="/">
              <div className="layout__sidebar__link">
                <img
                  src={noteTakingAppLogo}
                  className="layout__sidebar__link__logo"
                  alt="Note Taking App logo"
                />
              </div>
            </Link>
            <CreateNote onCreate={refreshNoteList} />
            <NoteList
              notes={noteList}
              activeNoteId={noteId}
              onDelete={handleDeleteNote}
            />
          </>
        )}
      </div>

      <main className="layout__content">
        <Outlet context={outletContext} />
      </main>
      <CustomTooltip />
    </div>
  );
}

export default Layout;

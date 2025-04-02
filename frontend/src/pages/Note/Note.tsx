import { useRequiredParam } from "@hooks/useRequiredParam";
import { unstable_usePrompt } from "react-router-dom";
import { useLayoutContext } from "@components/Layout.helpers";
import "./Note.scss";
import classNames from "classnames";
import useNote from "./hooks/useNote";
import EditableNote from "./components/EditableNote";

const versions = [
  {
    date: new Date().toISOString(),
    version: 3,
    note_id: "1",
  },
  {
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    version: 2,
    note_id: "1",
  },
  {
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    version: 1,
    note_id: "1",
  },
  {
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    version: 0,
    note_id: "1",
  },
];

function Note() {
  const noteId = useRequiredParam("noteId");
  const { handleDeleteNote } = useLayoutContext();
  const {
    remoteNote,
    isVersionControlVisible,
    selectedVersion,
    title,
    content,
    byPassPromptOnChangeRef,
    handleContentChange,
    handleTitleChange,
    handleVersionControlClick,
    refreshLastRemoteNote,
  } = useNote({
    noteId,
  });

  const handleDeleteNoteClick = () => {
    byPassPromptOnChangeRef.current = true;
    handleDeleteNote(noteId);
  };

  unstable_usePrompt({
    message:
      "Are you sure that you want to leave ? You have unsaved changes that will be lost if you leave.",
    when: () =>
      !byPassPromptOnChangeRef.current &&
      (title !== remoteNote?.title || content !== remoteNote?.content),
  });

  return (
    <div className="note">
      <EditableNote
        content={content}
        title={title}
        noteId={noteId}
        isSaveDisabled={
          title === remoteNote?.title && content === remoteNote?.content
        }
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        onDeleteNoteClick={handleDeleteNoteClick}
        onVersionControlClick={handleVersionControlClick}
        onSaveNoteClick={refreshLastRemoteNote}
      />
      <div
        className={classNames("note__sidebar", {
          "note__sidebar--collapsed": !isVersionControlVisible,
        })}
      >
        {isVersionControlVisible && (
          <>
            <div className="note__sidebar__title">Versions</div>
            <div className="note__sidebar__version-list">
              {versions.map((version) => (
                <span
                  key={version.version}
                  className={classNames("note__sidebar__version-list__item", {
                    "note__sidebar__version-list__item--active":
                      version.version === selectedVersion,
                  })}
                  onClick={() => {
                    console.log("Version Clicked", version.version);
                  }}
                >
                  {new Date(version.date).toLocaleDateString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Note;

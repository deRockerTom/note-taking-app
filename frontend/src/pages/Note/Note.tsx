import { useRequiredParam } from "@hooks/useRequiredParam";
import { unstable_usePrompt } from "react-router-dom";
import DeleteNote from "@components/DeleteNote/DeleteNote";
import { useLayoutContext } from "@components/Layout.helpers";
import SaveNote from "./components/SaveNote";
import VersionControlButton from "./components/VersionControlButton";
import "./Note.scss";
import classNames from "classnames";
import useNote from "./hooks/useNote";

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
    setRemoteNote,
    setIsVersionControlVisible,
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
      <div className="note__main">
        <div className="note__main__header">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="note__main__header__title"
            placeholder="Note Title"
          />
          <VersionControlButton
            onClick={() => {
              console.log("Version Control Clicked");
              setIsVersionControlVisible((prev) => !prev);
            }}
          />
          <DeleteNote
            noteId={noteId}
            className="note__main__header__trash-can"
            onDelete={handleDeleteNoteClick}
          />
        </div>
        <textarea
          value={content}
          onChange={handleContentChange}
          className="note__main__content"
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

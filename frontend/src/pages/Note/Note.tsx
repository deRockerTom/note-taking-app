import { useRequiredParam } from "@hooks/useRequiredParam";
import { unstable_usePrompt } from "react-router-dom";
import { useLayoutContext } from "@components/Layout.helpers";
import useNote from "./hooks/useNote";
import EditableNote from "./components/EditableNote";
import VersionSidebar from "./components/VersionSidebar";
import "./Note.scss";

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
      <VersionSidebar
        versions={versions}
        selectedVersion={selectedVersion}
        isVersionControlVisible={isVersionControlVisible}
        onVersionSelect={(version) => {
          console.log("Version Clicked", version.version);
        }}
      />
    </div>
  );
}

export default Note;

import { useRequiredParam } from "@hooks/useRequiredParam";
import { unstable_usePrompt } from "react-router-dom";
import { useLayoutContext } from "@components/Layout.helpers";
import useNote from "./hooks/useNote";
import EditableNote from "./components/EditableNote";
import VersionSidebar from "./components/VersionSidebar";
import "./Note.scss";

function Note() {
  const noteId = useRequiredParam("noteId");
  const { handleDeleteNote } = useLayoutContext();
  const {
    remoteNote,
    isVersionControlVisible,
    selectedVersion,
    title,
    content,
    versions,
    byPassPromptOnChangeRef,
    handleContentChange,
    handleTitleChange,
    handleVersionControlClick,
    handleVersionClick,
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
        onVersionSelect={handleVersionClick}
      />
    </div>
  );
}

export default Note;

import { useRequiredParam } from "@hooks/useRequiredParam";
import { unstable_usePrompt } from "react-router-dom";
import { useLayoutContext } from "@components/Layout.helpers";
import useNote from "./hooks/useNote";
import VersionSidebar from "./components/VersionSidebar";
import "./Note.scss";
import NotePage from "./components/NotePage";

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
    isLastVersion,
    showDiff,
    handleContentChange,
    handleTitleChange,
    handleVersionControlClick,
    handleVersionClick,
    handleRevertToVersionClick,
    handleSetShowDiff,
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
      {remoteNote && (
        <>
          <NotePage
            content={content}
            title={title}
            noteId={noteId}
            isSaveDisabled={
              title === remoteNote?.title && content === remoteNote?.content
            }
            remoteNote={remoteNote}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onDeleteNoteClick={handleDeleteNoteClick}
            onVersionControlClick={handleVersionControlClick}
            onRevertToVersion={() =>
              handleRevertToVersionClick(selectedVersion)
            }
            onSaveNoteClick={refreshLastRemoteNote}
            isLastVersion={isLastVersion}
            onDiffClick={handleSetShowDiff}
            showDiff={showDiff}
          />
          <VersionSidebar
            versions={versions}
            selectedVersion={selectedVersion}
            isVersionControlVisible={isVersionControlVisible}
            onVersionSelect={handleVersionClick}
          />
        </>
      )}
    </div>
  );
}

export default Note;

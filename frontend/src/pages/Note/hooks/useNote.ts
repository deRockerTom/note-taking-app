import {
  GetNoteVersionResponse,
  getNoteVersionsApiV1NotesNoteIdVersionsGet,
  getOneNoteApiV1NotesNoteIdGet,
  getOneNoteWithVersionApiV1NotesNoteIdVersionsVersionGet,
  Note,
  rollbackOneNoteApiV1NotesNoteIdRollbackPost,
} from "@client";
import { backendFetchClient } from "@shared/fetchClient";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface useNoteProps {
  noteId: string;
}

function useNote({ noteId }: useNoteProps) {
  const [remoteNote, setRemoteNote] = useState<Note | null>(null);
  const [isVersionControlVisible, setIsVersionControlVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(0);
  const [versions, setVersions] = useState<GetNoteVersionResponse[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const byPassPromptOnChangeRef = useRef(false);
  const isLastVersion = selectedVersion === versions.at(0)?.version;

  const navigate = useNavigate();

  const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
  };

  const refreshLastRemoteNote = useCallback(() => {
    getOneNoteApiV1NotesNoteIdGet({
      client: backendFetchClient,
      path: {
        note_id: noteId,
      },
      throwOnError: true,
    })
      .then(({ data }) => {
        setRemoteNote(data);
        setTitle(data.title);
        setContent(data.content);
        setSelectedVersion(data.version);
      })
      .catch((error) => {
        console.error("Error fetching note:", error);
        byPassPromptOnChangeRef.current = true;
        navigate("/")?.catch((error) => {
          console.error("Error navigating to Home after fetching note:", error);
        });
      });

    getNoteVersionsApiV1NotesNoteIdVersionsGet({
      client: backendFetchClient,
      path: {
        note_id: noteId,
      },
      throwOnError: true,
    })
      .then(({ data }) => {
        setVersions(data.notes);
      })
      .catch((error) => {
        console.error("Error fetching note versions:", error);
        byPassPromptOnChangeRef.current = true;
        navigate("/")?.catch((error) => {
          console.error(
            "Error navigating to Home after fetching note versions:",
            error,
          );
        });
      });
  }, [navigate, noteId]);

  const refreshRemoteNoteVersion = useCallback(
    (version: number) => {
      getOneNoteWithVersionApiV1NotesNoteIdVersionsVersionGet({
        client: backendFetchClient,
        path: {
          note_id: noteId,
          version: version,
        },
        throwOnError: true,
      })
        .then(({ data }) => {
          setRemoteNote(data);
          setSelectedVersion(version);
        })
        .catch((error) => {
          console.error("Error fetching note version:", error);
        });
    },
    [noteId],
  );

  const handleVersionClick = (version: GetNoteVersionResponse) => {
    refreshRemoteNoteVersion(version.version);
  };

  const handleVersionControlClick = () => {
    setIsVersionControlVisible((prev) => !prev);
  };

  const handleSetShowDiff = () => {
    setShowDiff((prev) => !prev);
  };

  const handleRevertToVersionClick = (version: number) => {
    const confirmationResponse = confirm(
      "Are you sure you want to delete this note? This action cannot be undone.",
    );
    if (!confirmationResponse) {
      return;
    }
    rollbackOneNoteApiV1NotesNoteIdRollbackPost({
      client: backendFetchClient,
      path: {
        note_id: noteId,
      },
      body: {
        version: version,
      },
    })
      .then(() => {
        refreshLastRemoteNote();
      })
      .catch((error) => {
        console.error("Error reverting to version:", error);
      });
  };

  useEffect(() => {
    refreshLastRemoteNote();
  }, [refreshLastRemoteNote]);

  return {
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
    handleSetShowDiff,
    handleRevertToVersionClick,
    refreshLastRemoteNote,
  };
}

export default useNote;

import {
  getOneNoteApiV1NotesNoteIdGet,
  getOneNoteWithVersionApiV1NotesNoteIdVersionsVersionGet,
  Note,
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
  const byPassPromptOnChangeRef = useRef(false);

  const navigate = useNavigate();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleVersionControlClick = () => {
    console.log("Version control clicked");
    setIsVersionControlVisible((prev) => !prev);
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
    byPassPromptOnChangeRef,
    handleContentChange,
    handleTitleChange,
    handleVersionControlClick,
    refreshRemoteNoteVersion,
    refreshLastRemoteNote,
  };
}

export default useNote;

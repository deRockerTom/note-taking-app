import { useParams } from "react-router-dom";
import "./Note.scss";
import { useEffect, useState } from "react";

const notes = {
  "1": {
    title: "First Note",
    content: "This is the content of the first note.",
  },
  "2": {
    title: "Second Note",
    content: "This is the content of the second note.",
  },
};

function Note() {
  const { noteId } = useParams();
  const note = notes[noteId || ""];

  // State to hold the current title and content
  const [title, setTitle] = useState<string>(note.title);
  const [content, setContent] = useState<string>(note.content);

  // Update title and content
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  return (
    <div className="note">
      {/* Editable title */}
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="note__title"
        placeholder="Note Title"
      />
      {/* Editable content */}
      <textarea
        value={content}
        onChange={handleContentChange}
        className="note__content"
        placeholder="Note Content"
      />
    </div>
  );
}

export default Note;

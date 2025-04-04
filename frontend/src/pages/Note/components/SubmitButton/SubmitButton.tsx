import SaveNote from "../SaveNote/SaveNote";
import "./SubmitButton.scss";

interface SubmitButtonProps {
  noteId: string;
  content: string;
  title: string;
  isLastVersion: boolean;
  onRevertToVersion: () => void;
  onSaveNoteClick: () => void;
  isSaveDisabled: boolean;
}

function SubmitButton({
  noteId,
  content,
  title,
  isLastVersion,
  onRevertToVersion,
  onSaveNoteClick,
  isSaveDisabled,
}: SubmitButtonProps) {
  return isLastVersion ? (
    <SaveNote
      noteId={noteId}
      content={content}
      title={title}
      onSave={onSaveNoteClick}
      disabled={isSaveDisabled}
    />
  ) : (
    <button
      className="submit-button__revert-button"
      onClick={onRevertToVersion}
      type="button"
    >
      Revert to Version
    </button>
  );
}

export default SubmitButton;

import { MouseEventHandler } from "react";
import VersionHistory from "../../../assets/VersionHistory.svg?react";
import "./VersionControlButton.scss";

interface VersionControlButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}
function VersionControlButton({ onClick }: VersionControlButtonProps) {
  return (
    <button
      className="version-control-button"
      onClick={onClick}
      title="Version Control"
      type="button"
    >
      <VersionHistory className="version-control-button__icon" />
    </button>
  );
}

export default VersionControlButton;

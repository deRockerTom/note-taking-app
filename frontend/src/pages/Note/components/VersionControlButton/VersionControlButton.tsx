import { MouseEventHandler } from "react";
import VersionHistory from "@assets/VersionHistory.svg?react";
import SVGButton from "@components/SVGButton/SVGButton";
import "./VersionControlButton.scss";

interface VersionControlButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}
function VersionControlButton({ onClick }: VersionControlButtonProps) {
  return (
    <SVGButton
      onClick={onClick}
      classNames={["version-control-button"]}
      SVGIcon={VersionHistory}
    />
  );
}

export default VersionControlButton;

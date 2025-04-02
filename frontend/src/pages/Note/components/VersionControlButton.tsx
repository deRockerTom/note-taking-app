import { MouseEventHandler } from "react";
import VersionHistory from "../../../assets/VersionHistory.svg?react";
import "./VersionControlButton.scss";
import SVGButton from "../../../components/SVGButton/SVGButton";

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

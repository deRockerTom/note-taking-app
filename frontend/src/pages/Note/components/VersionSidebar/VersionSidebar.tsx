import { GetNoteVersionResponse } from "@client";
import classNames from "classnames";
import "./VersionSidebar.scss";

interface VersionSidebarProps {
  versions: GetNoteVersionResponse[];
  selectedVersion: number;
  isVersionControlVisible: boolean;
  onVersionSelect: (version: GetNoteVersionResponse) => void;
}

function VersionSidebar({
  versions,
  selectedVersion,
  isVersionControlVisible,
  onVersionSelect,
}: VersionSidebarProps) {
  return (
    <div
      className={classNames("version-sidebar", {
        "version-sidebar--collapsed": !isVersionControlVisible,
      })}
    >
      {isVersionControlVisible && (
        <>
          <div className="version-sidebar__title">Versions</div>
          <div className="version-sidebar__version-list">
            {versions.map((version) => (
              <span
                key={version.version}
                className={classNames("version-sidebar__version-list__item", {
                  "version-sidebar__version-list__item--active":
                    version.version === selectedVersion,
                })}
                onClick={() => onVersionSelect(version)}
              >
                {new Date(version.date).toLocaleDateString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default VersionSidebar;

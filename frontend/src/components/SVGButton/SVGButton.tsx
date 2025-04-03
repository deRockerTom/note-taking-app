import { FunctionComponent, MouseEventHandler, SVGProps } from "react";
import classNamesFunction, { Value } from "classnames";
import "./SVGButton.scss";
import { TOOLTIP_ID } from "@components/CustomTooltip/tooltipUtils";

interface SVGButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  classNames?: Value[];
  tooltipContent?: string;
  SVGIcon: FunctionComponent<
    SVGProps<SVGSVGElement> & {
      title?: string;
      titleId?: string;
      desc?: string;
      descId?: string;
    }
  >; // https://github.com/pd4d10/vite-plugin-svgr/blob/main/client.d.ts
}

const emptyArray: Value[] = [];
function SVGButton({
  onClick,
  classNames = emptyArray,
  tooltipContent,
  SVGIcon,
}: SVGButtonProps) {
  return (
    <button
      className={classNamesFunction("svg-button", ...classNames)}
      onClick={onClick}
      type="button"
      data-tooltip-content={tooltipContent}
      data-tooltip-id={TOOLTIP_ID}
    >
      <SVGIcon
        className={classNamesFunction(
          "svg-button__icon",
          ...classNames.map((className) => className && `${className}__icon`),
        )}
      />
    </button>
  );
}

export default SVGButton;

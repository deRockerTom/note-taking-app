import { Tooltip } from "react-tooltip";
import { TOOLTIP_ID } from "./tooltipUtils";

function CustomTooltip() {
  return <Tooltip id={TOOLTIP_ID} className="data-tooltip" role="tooltip" />;
}

export default CustomTooltip;

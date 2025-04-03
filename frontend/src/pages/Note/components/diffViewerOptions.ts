import { ReactDiffViewerStylesOverride } from "react-diff-viewer-continued";

const diffStyleOptions: ReactDiffViewerStylesOverride = {
  // @ts-expect-error - This is an issue with the types of react-diff-viewer-continued
  summary: {
    display: "none",
  },
  diffContainer: {
    minWidth: 0,
  },
};

export { diffStyleOptions };

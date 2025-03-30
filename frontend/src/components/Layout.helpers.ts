import { useOutletContext } from "react-router-dom";

interface LayoutContext {
  refreshNoteList: () => void;
  handleDeleteNote: (noteIdToDelete: string) => void;
}

const useLayoutContext = () => useOutletContext<LayoutContext>();
export { useLayoutContext, type LayoutContext };

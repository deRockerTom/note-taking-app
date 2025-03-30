import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Note from "./pages/Note";
import "./App.scss"; // Global styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path=":noteId" element={<Note />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

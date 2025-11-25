import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Placeholder routes for future pages */}
        <Route path="/cursos/:category" element={<Home />} />
        <Route path="/curso/:id" element={<Home />} />
        <Route path="/proyectos" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

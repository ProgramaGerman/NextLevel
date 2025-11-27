import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Home } from "./pages/Home";
import Product from "./pages/product";
import "./index.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        {/* Placeholder routes for future pages */}
        <Route path="/cursos/:category" element={<Home />} />
        <Route path="/curso/:id" element={<Product />} />
        <Route path="/proyectos" element={<Home />} />
        <Route path="/producto/:id" element={<Product />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;

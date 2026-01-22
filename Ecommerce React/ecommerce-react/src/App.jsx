import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Home } from "./pages/Home";
import "./index.css";

// Lazy load Product page for better performance
const Product = lazy(() => import("./pages/product"));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      }>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          {/* Placeholder routes for future pages */}
          <Route path="/cursos/:category" element={<Home />} />
          <Route path="/curso/:id" element={<Product />} />
          <Route path="/proyectos" element={<Home />} />
          <Route path="/producto/:id" element={<Product />} />
        </Routes>
      </Suspense>
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

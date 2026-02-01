import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./context/CartContext";
import { Home } from "./pages/Home";
import "./index.css";

// Lazy load pages for better performance
const Product = lazy(() => import("./pages/product"));
const Buy = lazy(() => import("./pages/buy"));
const Payment = lazy(() => import("./pages/Payment"));
const Cart = lazy(() => import("./pages/Cart"));
const Invoice = lazy(() => import("./pages/Invoice"));

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
          <Route path="/comprar/:id" element={<Buy />} />
          <Route path="/pago/:id" element={<Payment />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/factura/:id" element={<Invoice />} />
          <Route path="/proyectos" element={<Home />} />
          <Route path="/producto/:id" element={<Product />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

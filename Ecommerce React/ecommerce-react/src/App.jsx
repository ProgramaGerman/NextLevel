import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./context/CartContext";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import { EnrollmentProvider } from "./context/EnrollmentContext";
import { ReviewProvider } from "./context/ReviewContext";
import { SearchProvider } from "./context/SearchContext";
import { Home } from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

// Lazy load pages for better performance
const Product = lazy(() => import("./pages/product"));
const Buy = lazy(() => import("./pages/buy"));
const Payment = lazy(() => import("./pages/Payment"));
const Cart = lazy(() => import("./pages/Cart"));
const Invoice = lazy(() => import("./pages/Invoice"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CoursePlayer = lazy(() => import("./pages/CoursePlayer"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Results = lazy(() => import("./pages/Results"));
const Profile = lazy(() => import("./pages/Profile"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory"));
const TestPage = lazy(() => import("./pages/TestPage"));

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
          {/* Test Route */}
          <Route path="/test" element={<TestPage />} />
          
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cursos/:category" element={<Home />} />
          <Route path="/curso/:id" element={<Product />} />
          <Route path="/comprar/:id" element={<Buy />} />
          <Route path="/proyectos" element={<Home />} />
          <Route path="/producto/:id" element={<Product />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Require Authentication */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/pagos" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
          <Route path="/aprender/:id" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/resultados/:id" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/carrito" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/pago/:id" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/factura/:id" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <EnrollmentProvider>
          <ReviewProvider>
            <CartProvider>
              <SearchProvider>
                <BrowserRouter>
                  <AnimatedRoutes />
                </BrowserRouter>
              </SearchProvider>
            </CartProvider>
          </ReviewProvider>
        </EnrollmentProvider>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;

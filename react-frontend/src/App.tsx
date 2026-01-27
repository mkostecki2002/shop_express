import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { AppProvider, useApp } from "./contexts/AppContext.tsx";
import Navbar from "./components/Navbar";
import ProductListPage from "./pages/ProductListPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminInitPage from "./pages/AdminInitPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "bootstrap/dist/css/bootstrap.min.css";
import UserOrdersPage from "./pages/UserOrdersPage";
import { ErrorBanner } from "./components/ErrorBanner.tsx";
import { MessageBanner } from "./components/MessageBanner.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import { LoadingOverlay } from "./components/LoadingOverlay.tsx";

// Komponent chroniący trasy
const ProtectedRoute = ({
  children,
  role,
}: {
  // 2. ZMIEŃ JSX.Element NA React.ReactNode
  children: React.ReactNode;
  role?: string;
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role)
    return <div className="p-4 text-danger">Brak uprawnień</div>;

  // 3. (Opcjonalnie) Owiń children we fragment, choć przy ReactNode zwykłe zwrócenie też zadziała
  return <>{children}</>;
};

// --- NOWY KOMPONENT: LAYOUT GŁÓWNY ---
// Ten komponent zawiera elementy widoczne na standardowych stronach
const MainLayout = () => {
  const { isLoading } = useApp();

  return (
    <>
      <LoadingOverlay isVisible={isLoading} message="Proszę czekać..." />
      <Navbar />
      <ErrorBanner />
      <MessageBanner />
      <Outlet />
    </>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute role="CUSTOMER">
              <UserOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/init"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminInitPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* GRUPA 2: Strony samodzielne (BEZ Navbara i Banerów) */}
      {/* Są poza MainLayout, więc renderują się na czystej stronie */}
      <Route path="/error-page" element={<ErrorPage />} />

      {/* Catch-all przekierowuje do error-page */}
      <Route path="*" element={<Navigate to="/error-page" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;

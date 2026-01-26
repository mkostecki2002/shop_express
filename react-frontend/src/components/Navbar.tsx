import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useCart } from "../contexts/CartContext.tsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Sklep
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Wspólne */}
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/products")}`}
                to="/products"
              >
                Produkty
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/cart")}`} to="/checkout">
                Koszyk{" "}
                <span className="badge bg-light text-dark ms-1">
                  {cart.length}
                </span>
              </Link>
            </li>

            {/* Tylko KLIENT */}
            {user?.role === "CUSTOMER" && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/my-orders")}`}
                    to="/my-orders"
                  >
                    Moje Zamówienia
                  </Link>
                </li>
              </>
            )}

            {/* Tylko ADMIN */}
            {user?.role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/admin/orders")}`}
                    to="/admin/orders"
                  >
                    Zarządzaj Zamówieniami
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/admin/init")}`}
                    to="/admin/init"
                  >
                    Inicjalizacja Bazy
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="text-white">
                <small className="me-2 opacity-75">
                  Zalogowany jako: {user.sub} ({user.role})
                </small>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={logout}
                >
                  Wyloguj
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link className="btn btn-light btn-sm" to="/login">
                  Zaloguj
                </Link>
                <Link className="btn btn-outline-light btn-sm" to="/register">
                  Rejestracja
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

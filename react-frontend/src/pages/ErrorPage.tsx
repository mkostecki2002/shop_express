import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

export default function ErrorPage() {
  const { errorStatus, errorMessage, clearError } = useApp();
  const navigate = useNavigate();

  const handleGoHome = () => {
    clearError();
    navigate("/");
  };

  // Domyślne wartości, jeśli wejdziemy tu przypadkiem
  let title = "Ups!";
  let description = errorMessage || "Wystąpił nieznany błąd.";
  let icon = "⚠️";

  if (errorStatus === 404) {
    title = "404 - Nie znaleziono";
    description = "Strona, której szukasz, nie istnieje.";
    icon = "🔍";
  } else if (errorStatus === 0) {
    title = "Brak połączenia";
    description = "Serwer jest nieosiągalny. Sprawdź swoje łącze internetowe.";
    icon = "📡";
  } else if (errorStatus && errorStatus >= 500) {
    title = "500 - Błąd Serwera";
    description = "Mamy problemy techniczne po stronie serwera. Przepraszamy.";
    icon = "🔥";
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <div style={{ fontSize: "4rem" }}>{icon}</div>
      <h1 className="display-4 fw-bold">{title}</h1>
      <p className="lead text-muted mb-4">{description}</p>

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          Wróć
        </button>
        <button className="btn btn-primary" onClick={handleGoHome}>
          Strona Główna
        </button>
      </div>
    </div>
  );
}

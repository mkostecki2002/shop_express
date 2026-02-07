import { useApp } from "../contexts/AppContext";

export function ErrorBanner() {
  const { errorMessage, clearError } = useApp();

  if (!errorMessage) return null;

  return (
    <div className="alert alert-danger text-center" role="alert">
      {errorMessage}
      <button type="button" className="btn-close" onClick={clearError}></button>
    </div>
  );
}

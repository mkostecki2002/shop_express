import { useApp } from "../contexts/AppContext";

export function MessageBanner() {
  const { message, clearMessage } = useApp();

  if (!message) return null;

  return (
    <div className="alert alert-info text-center" role="alert">
      {message}
      <button
        type="button"
        className="btn-close"
        onClick={clearMessage}
      ></button>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/services";
import { useApp } from "../contexts/AppContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    role: "CUSTOMER",
  });
  // Stan do pokazywania/ukrywania hasła
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setMessage, handleError } = useApp();

  // Funkcja generująca silne hasło
  const generateStrongPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    const length = 12;
    let password = "";
    // crypto.getRandomValues dla lepszego bezpieczeństwa losowości
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }

    setForm(prev => ({ ...prev, password: password }));
    setShowPassword(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setMessage("Konto założone. Zaloguj się.");
      navigate("/login");
    } catch (e: any) {
      handleError(e.response?.data || e.message);
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center mt-5">
        <form className="card p-4 col-md-5" onSubmit={handleRegister}>
          <h3 className="text-center">Rejestracja</h3>

          <div className="mb-2">
            <label className="form-label">Login</label>
            <input
              className="form-control"
              placeholder="Login"
              required
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Telefon</label>
            <input
              className="form-control"
              placeholder="Telefon"
              required
              value={form.phoneNumber}
              onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Hasło</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Hasło"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                title="Pokaż/Ukryj hasło"
              >
                {showPassword ? "Ukryj" : "Pokaż"}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={generateStrongPassword}
                title="Wygeneruj losowe silne hasło"
              >
                Generuj
              </button>
            </div>
            <small className="text-muted">
              Kliknij "Generuj", aby stworzyć silne hasło.
            </small>
          </div>

          <button className="btn btn-success w-100">Zarejestruj</button>
        </form>
      </div>
    </>
  );
}

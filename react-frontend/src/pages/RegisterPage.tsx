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
  const navigate = useNavigate();
  const { setMessage, handleError } = useApp();

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
          <input
            className="form-control mb-2"
            placeholder="Login"
            required
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            required
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Telefon"
            required
            onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
          />
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Hasło"
            required
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button className="btn btn-success">Zarejestruj</button>
        </form>
      </div>
    </>
  );
}

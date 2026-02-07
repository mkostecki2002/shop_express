import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";

export default function LoginPage() {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const { handleError } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(creds);
      navigate("/products");
    } catch (err: any) {
      handleError(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <form className="card p-4 col-md-4" onSubmit={handleSubmit}>
        <h3 className="text-center">Logowanie</h3>
        <input
          className="form-control mb-2"
          placeholder="Login"
          onChange={e => setCreds({ ...creds, username: e.target.value })}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Hasło"
          onChange={e => setCreds({ ...creds, password: e.target.value })}
        />
        <button className="btn btn-primary">Zaloguj</button>
      </form>
    </div>
  );
}

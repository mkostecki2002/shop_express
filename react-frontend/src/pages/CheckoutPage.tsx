import { useState } from "react";
import { useCart } from "../contexts/CartContext.tsx";
import { createOrder } from "../api/services.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useApp } from "../contexts/AppContext.tsx";

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } =
    useCart();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
  const { setMessage, setErrorMessage, errorMessage } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated === false) {
      setMessage("Stwórz konto i dokończ zamówienie.");
      navigate("/register");
      return;
    }

    try {
      const orderPayload = {
        ...formData,
        orderItems: cart.map(item => ({
          product: { id: item.product.id },
          quantity: item.quantity,
        })),
        orderState: { name: "UNCONFIRMED" },
      };

      await createOrder(orderPayload as any);
      clearCart();
      setMessage("Zamówienie zostało złożone.");
      navigate("/products");
    } catch (e: any) {
      setErrorMessage(
        e.response?.data?.message || "Unexpected error during order creation",
      );
    }
  };

  if (cart.length === 0)
    return <div className="container">Koszyk jest pusty.</div>;

  return (
    <div className="container">
      <h2>Twoje Zamówienie</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Cena jedn.</th>
            <th>Ilość</th>
            <th>Suma</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.product.id}>
              <td>{item.product.name}</td>
              <td>{item.product.priceUnit} zł</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                {item.quantity}
                <button
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </td>
              <td>{(item.product.priceUnit * item.quantity).toFixed(2)} zł</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-end fw-bold">
              Łącznie:
            </td>
            <td className="fw-bold">{totalPrice.toFixed(2)} zł</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <h3 className="mt-4">Dane Kontaktowe</h3>
      <form onSubmit={handleSubmit} className="card p-4 bg-light">
        <div className="mb-3">
          <label>Nazwa użytkownika</label>
          <input
            className="form-control"
            required
            value={formData.username}
            onChange={e =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Telefon</label>
          <input
            className="form-control"
            required
            pattern="[0-9]+"
            value={formData.phoneNumber}
            onChange={e =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
        </div>
        <button className="btn btn-primary btn-lg w-100">
          Złóż zamówienie
        </button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getMyOrders, addOpinion } from "../api/services";
import type { Order } from "../api/services";
import { useApp } from "../contexts/AppContext";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { handleError, setIsLoading } = useApp();

  // Modal opinii
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [opinionData, setOpinionData] = useState({ rating: 5, content: "" });
  const { setMessage } = useApp();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const { data } = await getMyOrders(); // Specjalny endpoint dla usera
      setOrders(data);
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    try {
      await addOpinion(selectedOrderId, opinionData);
      setMessage("Dziękujemy za Twoją opinię!");
      setSelectedOrderId(null);
      fetchMyOrders(); // Odśwież, by ukryć przycisk
    } catch (e: any) {
      handleError(e);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 border-bottom pb-2">Moje Zamówienia</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          Nie złożyłeś jeszcze żadnych zamówień.
        </div>
      ) : (
        <div className="row g-4">
          {orders.map(order => {
            const isCompleted =
              order.orderState?.name === "COMPLETED" ||
              order.orderState?.name === "CANCELLED";
            const hasOpinion = order.opinions && order.opinions.length > 0;
            const total = order.orderItems.reduce(
              (sum, item: any) => sum + item.unitPrice * item.quantity,
              0,
            );

            return (
              <div key={order.id} className="col-12">
                <div className="card shadow-sm">
                  <div className="card-header d-flex justify-content-between align-items-center bg-light">
                    <span>
                      <strong>Zamówienie #{order.id}</strong> z dnia{" "}
                      {new Date(order.approvalDate || "").toLocaleDateString()}
                    </span>
                    <span
                      className={`badge ${isCompleted ? "bg-success" : "bg-warning text-dark"}`}
                    >
                      {order.orderState?.name}
                    </span>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush mb-3">
                      {order.orderItems.map((item: any, idx) => (
                        <li
                          key={idx}
                          className="list-group-item d-flex justify-content-between"
                        >
                          <span>
                            {item.product?.name}{" "}
                            <small className="text-muted">
                              x{item.quantity}
                            </small>
                          </span>
                          <span>
                            {(item.unitPrice * item.quantity).toFixed(2)} zł
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Suma: {total.toFixed(2)} zł</h5>

                      {/* Przycisk Oceny */}
                      {isCompleted && !hasOpinion && (
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setSelectedOrderId(order.id!)}
                        >
                          Oceń zamówienie
                        </button>
                      )}
                      {hasOpinion && (
                        <span className="text-success fw-bold">
                          ✓ Dziękujemy za opinię
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL (Prosty overlay) */}
      {selectedOrderId && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Oceń zamówienie #{selectedOrderId}</h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedOrderId(null)}
                ></button>
              </div>
              <form onSubmit={handleRate}>
                <div className="modal-body">
                  <label>Ocena (1-5)</label>
                  <select
                    className="form-select mb-3"
                    value={opinionData.rating}
                    onChange={e =>
                      setOpinionData({
                        ...opinionData,
                        rating: +e.target.value,
                      })
                    }
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <label>Komentarz</label>
                  <textarea
                    className="form-control"
                    required
                    value={opinionData.content}
                    onChange={e =>
                      setOpinionData({
                        ...opinionData,
                        content: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedOrderId(null)}
                  >
                    Anuluj
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Wyślij
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

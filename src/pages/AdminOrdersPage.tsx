import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../api/services";
import type { Order, OrderItem, Opinion } from "../api/services";
import { useApp } from "../contexts/AppContext";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const { setIsLoading, handleError } = useApp();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await getOrders();
      setOrders(data);
    } catch (e: any) {
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      loadOrders();
    } catch (e: any) {
      handleError(e);
    }
  };

  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : orders.filter(o => o.orderState?.name === filterStatus);

  const unfulfilled = orders.filter(
    o =>
      o.orderState?.name !== "COMPLETED" && o.orderState?.name !== "CANCELLED",
  );

  return (
    <div className="container">
      <h2>Panel Zamówień</h2>

      <div className="card mb-4 border-danger">
        <div className="card-header bg-danger text-white">
          Niezrealizowane Zamówienia
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Klient</th>
                <th>Stan</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {unfulfilled.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>
                    {o.approvalDate
                      ? new Date(o.approvalDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{o.username}</td>
                  <td>{o.orderState?.name}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-1"
                      onClick={() => handleStatusChange(o.id!, "COMPLETED")}
                    >
                      Zrealizuj
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleStatusChange(o.id!, "CANCELLED")}
                    >
                      Anuluj
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h4>Wszystkie zamówienia</h4>
      <div className="mb-3">
        <label className="me-2">Filtruj stan:</label>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="form-select w-auto d-inline-block"
        >
          <option value="ALL">Wszystkie</option>
          <option value="UNCONFIRMED">Niepotwierdzone</option>
          <option value="CONFIRMED">Potwierdzone</option>
          <option value="COMPLETED">Zrealizowane</option>
          <option value="CANCELLED">Anulowane</option>
        </select>
      </div>

      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Wartość</th>
            <th>Status</th>
            <th style={{ minWidth: "250px" }}>Opinie</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(o => {
            const total = o.orderItems.reduce(
              (acc, item: OrderItem) =>
                acc + (item.product?.priceUnit || 0) * item.quantity,
              0,
            );

            return (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>
                  {o.approvalDate
                    ? new Date(o.approvalDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>{total.toFixed(2)} zł</td>
                <td>
                  <span
                    className={`badge ${
                      o.orderState?.name === "COMPLETED"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {o.orderState?.name}
                  </span>
                </td>
                <td>
                  {o.opinions && o.opinions.length > 0 ? (
                    o.opinions.map((op: Opinion) => (
                      <div
                        key={op.id}
                        className="mb-2 p-2 border rounded bg-white shadow-sm"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-warning">
                            {"★".repeat(op.rating)}
                            <span className="text-muted ms-1 small">
                              ({op.rating}/5)
                            </span>
                          </strong>
                          {op.createdAt && (
                            <small
                              className="text-muted"
                              style={{ fontSize: "0.75em" }}
                            >
                              {new Date(op.createdAt).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                        <div className="fst-italic text-dark">
                          "{op.content}"
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted small fst-italic">
                      Brak opinii
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

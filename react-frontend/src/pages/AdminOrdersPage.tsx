import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../api/services";
import type { Order } from "../api/services";
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
                  <td>{o.approvalDate || "Brak"}</td>
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

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data Zatwierdzenia</th>
            <th>Wartość</th>
            <th>Status</th>
            <th>Opinie (D4)</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(o => {
            const total = o.orderItems.reduce(
              (acc, item: any) => acc + item.unitPrice * item.quantity,
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
                <td>{o.orderState?.name}</td>
                <td>
                  {o.opinions && o.opinions.length > 0 ? (
                    o.opinions.map((op: any, idx: number) => (
                      <div key={idx} className="small">
                        {op.rating}: {op.content}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">Brak</span>
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

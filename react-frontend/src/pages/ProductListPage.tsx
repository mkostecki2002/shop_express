import { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  getCategories,
  updateProduct,
  getSeoDescription,
} from "../api/services";
import type { Product } from "../api/services";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useApp } from "../contexts/AppContext";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [filterName, setFilterName] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 3;

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { handleError, setMessage, setIsLoading } = useApp();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [pData, cData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(pData.data ?? []);
      setCategories(cData.data ?? []);
    } catch (err: any) {
      console.error(err);
      handleError(err);
      setProducts([]);
      setCategories([]);
    } finally {
      {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (filterName) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(filterName.toLowerCase()),
      );
    }

    if (filterCat) {
      result = result.filter(p => p.category?.name === filterCat);
    }

    return result;
  }, [products, filterName, filterCat]);

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setEditForm({
      ...p,
      priceUnit: Number(p.priceUnit),
      weightUnit: Number(p.weightUnit),
    });
  };

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const currentVisibleProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Funkcja zmiany strony
  const changePage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, editForm);
      setEditingProduct(null);
      fetchData();
      setMessage("Produkt zaktualizowany pomyślnie.");
    } catch (e: any) {
      handleError(e);
    }
  };

  const handleSeoOptimize = async () => {
    if (!editingProduct) return;
    try {
      const { data } = await getSeoDescription(editingProduct.id);
      setEditForm(prev => ({ ...prev, description: data }));
    } catch (e: any) {
      handleError(e);
    }
  };

  return (
    <div className="container">
      <h2>Produkty</h2>

      {/* Filtry */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Szukaj..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            <option value="">Wszystkie kategorie</option>
            {categories.map(c => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela */}
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Opis</th>
            <th>Kategoria</th>
            <th>Cena</th>
            <th>Waga</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {currentVisibleProducts.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td dangerouslySetInnerHTML={{ __html: p.description }}></td>
              {/* ▼▼▼ TUTAJ ZMIANA ▼▼▼ */}
              <td>{p.category?.name || "Brak kategorii"}</td>
              {/* ▲▲▲ KONIEC ZMIANY ▲▲▲ */}
              <td>{p.priceUnit} zł</td>
              <td>{p.weightUnit} kg</td>
              <td>
                {user?.role === "ADMIN" && (
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(p)}
                  >
                    Edytuj
                  </button>
                )}
                {(!user || user.role === "CUSTOMER") && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      addToCart(p);
                      setMessage("Produkt " + p.name + " dodany do koszyka.");
                    }}
                  >
                    Kup
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <div className="card mt-4 bg-light p-3 border-warning">
          <h3>Edycja: {editingProduct.name}</h3>
          <div className="row g-3">
            <div className="col-md-6">
              <label>Cena</label>
              <input
                type="number"
                className="form-control"
                value={editForm.priceUnit}
                onChange={e =>
                  setEditForm({
                    ...editForm,
                    priceUnit: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="col-md-6">
              <label>Waga</label>
              <input
                type="number"
                className="form-control"
                value={editForm.weightUnit}
                onChange={e =>
                  setEditForm({
                    ...editForm,
                    weightUnit: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="col-12">
              <label>Opis (HTML)</label>
              <textarea
                className="form-control"
                rows={4}
                value={editForm.description}
                onChange={e =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              ></textarea>
              <button
                className="btn btn-info btn-sm mt-2"
                onClick={handleSeoOptimize}
              >
                Optymalizuj opis pod SEO
              </button>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={handleSave}>
              Zapisz
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setEditingProduct(null)}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => changePage(currentPage - 1)}
              >
                Poprzednia
              </button>
            </li>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <li
                  key={pageNum}
                  className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => changePage(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            })}

            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => changePage(currentPage + 1)}
              >
                Następna
              </button>
            </li>
          </ul>
        </nav>
      )}
      <div className="text-center text-muted small">
        Strona {currentPage} z {totalPages} (Wszystkich produktów: {totalItems})
      </div>
    </div>
  );
}

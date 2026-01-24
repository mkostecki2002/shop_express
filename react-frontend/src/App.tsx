import { useEffect, useState } from "react";
import { fetchProducts } from "./api/api.ts";

interface Category {
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  priceUnit: number;
  weightUnit: number;
  category: Category;
}

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(products => {
      //Mozna porobic tabelki w logach
      console.log(products);
      setProducts(products);
    });
  }, []);

  return (
    <>
      <h2>Products</h2>

      <div className="d-md">
        <table className="table table-hover text-start align-middle">
          <thead>
            <tr>
              <th>Product name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Weight</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.priceUnit}</td>
                <td>{product.weightUnit}</td>
                <td>{product.category.name}</td>
                <td>
                  {/* TODO Dodawanie do koszyka za pomocą tego przycisku */}
                  <button className="btn btn-primary btn-sm">Buy</button>
                </td>
                <td>
                  {/* TODO Edytowanie produktów, może byc inaczej, to takie wstępne na razie */}
                  <button className="btn btn-primary btn-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;

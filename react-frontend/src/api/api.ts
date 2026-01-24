const API_URL = "http://localhost:3000/";

export async function fetchProducts() {
  const response = await fetch(`${API_URL}products`);
  return response.json();
}

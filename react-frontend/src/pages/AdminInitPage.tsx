import React, { useState } from "react";
import { initDatabase } from "../api/services";

export default function AdminInitPage() {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setFileContent(text);
      setFileType(file.type || "text/plain"); // Domyślnie text/plain dla CSV
    };
    reader.readAsText(file);
  };

  const handleInit = async () => {
    if (!fileContent) return;

    // Walidacja po stronie klienta (czy to JSON lub CSV)
    let isValid = false;
    try {
      if (
        fileContent.trim().startsWith("[") ||
        fileContent.trim().startsWith("{")
      ) {
        JSON.parse(fileContent);
        isValid = true;
      } else if (fileContent.includes(",")) {
        // Prymitywna walidacja CSV
        isValid = true;
      }
    } catch (e) {
      isValid = false;
    }

    if (!isValid)
      return alert("Niepoprawny format pliku (wymagany JSON lub CSV).");

    try {
      // API oczekuje surowej zawartości w body i odpowiedniego Content-Type
      const contentType = fileContent.trim().startsWith("[")
        ? "application/json"
        : "text/plain";
      await initDatabase(fileContent, contentType);
      alert("Baza zainicjalizowana pomyślnie!");
    } catch (e: any) {
      alert("Błąd: " + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div className="container">
      <h2>Inicjalizacja Bazy Danych (D3)</h2>
      <p>Wgraj plik JSON lub CSV, aby uzupełnić produkty.</p>
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
          accept=".json,.csv,.txt"
        />
      </div>
      <button
        className="btn btn-danger"
        disabled={!fileContent}
        onClick={handleInit}
      >
        Zainicjalizuj Bazę
      </button>

      {fileContent && (
        <div className="mt-3">
          <h5>Podgląd:</h5>
          <pre
            className="bg-light p-2 border"
            style={{ maxHeight: "200px", overflow: "auto" }}
          >
            {fileContent.substring(0, 500)}...
          </pre>
        </div>
      )}
    </div>
  );
}

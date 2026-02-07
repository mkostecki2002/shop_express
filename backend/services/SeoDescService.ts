import axios from "axios";
import { Product } from "../entity/Product";

export async function generateSeoDesc(product: Product): Promise<string> {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          // Zmiana: Instrukcja dla modelu, aby pisał po polsku i krótko
          content:
            "Jesteś ekspertem SEO. Generujesz opisy produktów w języku polskim. Opis musi być czystym tekstem i składać się z maksymalnie 3 zdań.",
        },
        {
          role: "user",
          content: `
Nazwa produktu: ${product.name}
Oryginalny opis: ${product.description}
Kategoria: ${product.category?.name}
Cena: ${product.priceUnit}
Waga: ${product.weightUnit}

Napisz przekonujący opis produktu pod SEO w języku polskim (maksymalnie 3 zdania).
          `,
        },
      ],
      temperature: 0.5,
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.choices[0].message.content;
}

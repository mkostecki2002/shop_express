import "reflect-metadata";
import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import "./controllers/OrderController";
import ProductController from "./controllers/ProductController";
import { validateProductsArray } from "./services/ProductService";
import OrderController from "./controllers/OrderController";
import AuthController from "./controllers/AuthController";
import { initializeDatabase, AppDataSource } from "./data-source";
import { StatusCodes } from "http-status-codes";
import { Category } from "./entity/Category";
import { requireRole, verifyAccess } from "./Authentication";
import { UserRole } from "./entity/User";
import { Product } from "./entity/Product";
import { parse } from "csv-parse/sync";
import { OrderState } from "./entity/OrderState";

// Aplikacja Express
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.text({ type: ["text/plain", "text/csv"] }));

app.use("/orders", OrderController);
app.use("/products", ProductController);
app.use("/", AuthController);

//Kategorie
app.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await AppDataSource.getRepository(Category).find();

    res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching categories",
      error,
    });
  }
});

app.get("/status", async (req: Request, res: Response) => {
  try {
    const states = await AppDataSource.getRepository(OrderState).find();

    res.status(StatusCodes.OK).json(states);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching categories",
      error,
    });
  }
});

app.post(
  "/init",
  verifyAccess,
  requireRole(UserRole.Admin),
  validateProductsArray,
  async (req: Request, res: Response) => {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const existing = await productRepository.count();
      if (existing > 0) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Products already exist" });
      }
      console.log("Initializing database with products");
      console.log("Content-Type:", req.headers["content-type"]);
      console.log("Body:", req.body);
      let products: Partial<Product>[] = [];

      if (req.is("application/json")) {
        products = req.body;
      } else if (req.is("text/plain")) {
        console.log("Parsing CSV data", req.body);

        const csvData = req.body;
        products = parse(csvData, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });
        console.log("Parsed products from CSV:", products);
      } else {
        return res
          .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
          .json({ message: "Unsupported content type" });
      }
      for (const prodData of products) {
        const product = productRepository.create(prodData);
        await productRepository.save(product);
      }
      return res
        .status(StatusCodes.OK)
        .json({ message: "Database initialized successfully" });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error initializing database", error });
    }
  },
);

// Asynchroniczna funkcja główna
async function main() {
  try {
    await initializeDatabase();

    // 2. Uruchomienie serwera Express.
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // Logowanie błędu, jeśli inicjalizacja bazy nie powiedzie się
    console.error("Failed to start server due to database error:", error);
    process.exit(1);
  }
}

// Uruchomienie aplikacji
main();

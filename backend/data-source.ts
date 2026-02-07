import { DataSource } from "typeorm";
import { Product } from "./entity/Product";
import { Order } from "./entity/Order";
import { User } from "./entity/User";
import { Category } from "./entity/Category";
import { OrderItem } from "./entity/OrderItem";
import { OrderState } from "./entity/OrderState";
import { RefreshToken } from "./entity/RefreshToken";
import { Opinion } from "./entity/Opinion";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "mydb",
  entities: [
    Product,
    Category,
    Order,
    OrderItem,
    OrderState,
    User,
    Opinion,
    RefreshToken,
  ],
  logging: true,
  synchronize: true,
});

// Funkcja do inicjalizacji
export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization", error);
    throw error;
  }
}

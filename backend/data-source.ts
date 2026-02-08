import { DataSource } from "typeorm";
import { Product } from "./entity/Product";
import { Order } from "./entity/Order";
import { User, UserRole } from "./entity/User";
import { Category, CategoryName } from "./entity/Category";
import { OrderItem } from "./entity/OrderItem";
import { OrderState } from "./entity/OrderState";
import { RefreshToken } from "./entity/RefreshToken";
import { Opinion } from "./entity/Opinion";
import { hash } from "bcryptjs";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "shopdb",
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

    const categoryRepository = AppDataSource.getRepository(Category);
    const userRepository = AppDataSource.getRepository(User);

    const count = await categoryRepository.count();

    if (count === 0) {
      const categoriesToCreate = [
        { name: CategoryName.Electronics },
        { name: CategoryName.Clothing },
        { name: CategoryName.Home },
        { name: CategoryName.Books },
        { name: CategoryName.Sports },
      ];
      userRepository.save({
        username: "admin",
        password: await hash("admin123", 10),
        email: "admin@email.com",
        phoneNumber: "123456789",
        role: UserRole.Admin,
      });

      await categoryRepository.save(categoriesToCreate);
    }
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization", error);
    throw error;
  }
}

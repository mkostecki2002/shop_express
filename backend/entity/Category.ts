import { Entity, PrimaryColumn } from "typeorm";

export enum CategoryName {
  Electronics = "Electronics",
  Clothing = "Clothing",
  Home = "Home",
  Books = "Books",
  Sports = "Sports",
}

@Entity({ name: "categories" })
export class Category {
  @PrimaryColumn()
  name!: CategoryName;
}

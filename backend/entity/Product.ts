import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Category } from "./Category";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  priceUnit!: number;

  @Column({ type: "float" })
  weightUnit!: number;

  @ManyToOne(() => Category, category => category.name, {
    nullable: false,
    onDelete: "CASCADE",
  })
  category!: Category;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity({ name: "order_items" })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  discount!: number | null;

  @ManyToOne(() => Order, order => order.id, {
    nullable: false,
    onDelete: "CASCADE",
  })
  order!: Order;

  @ManyToOne(() => Product, product => product.id, {
    nullable: false,
    onDelete: "CASCADE",
  })
  product!: Product;
}

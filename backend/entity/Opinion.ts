import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn} from "typeorm";
import { Order } from "./Order";

@Entity("opinions")
export class Opinion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  rating!: number; // 1–5

  @Column({ type: "text" })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Order, order => order.opinions, { onDelete: "CASCADE" })
  order!: Order;
}

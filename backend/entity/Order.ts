import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { OrderItem } from "./OrderItem";
import { OrderState } from "./OrderState";
import { Opinion } from "./Opinion";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamp", nullable: true })
  approvalDate!: Date | null;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  phoneNumber!: string;

  @ManyToOne(() => OrderState, orderState => orderState.name)
  orderState!: OrderState;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, {
    cascade: true,
  })
  orderItems!: OrderItem[];

  @OneToMany(() => Opinion, opinion => opinion.order)
  opinions!: Opinion[];
}

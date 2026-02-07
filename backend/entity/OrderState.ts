import { Entity, PrimaryColumn } from "typeorm";

export enum OrderStateName {
  Unconfirmed = "UNCONFIRMED",
  Confirmed = "CONFIRMED",
  Cancelled = "CANCELLED",
  Completed = "COMPLETED",
}

export const OrderStateFlow: OrderStateName[] = [
  OrderStateName.Unconfirmed,
  OrderStateName.Confirmed,
  OrderStateName.Completed,
  OrderStateName.Cancelled,
];

@Entity({ name: "order_states" })
export class OrderState {
  @PrimaryColumn()
  name!: OrderStateName;
}

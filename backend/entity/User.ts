import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  Admin = "ADMIN",
  Customer = "CUSTOMER",
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  password!: string;

  @Column()
  role!: UserRole;
}

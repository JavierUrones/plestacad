import { UserRole } from "./role.enum";

export class User {
    email!: string;
    password!: string;
    name!: string;
    surname!: string
    role!: UserRole;
  }
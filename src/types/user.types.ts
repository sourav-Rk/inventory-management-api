export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: "staff";
  createdAt?: Date;
  updatedAt?: Date;
}

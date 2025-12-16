export interface IItem {
  _id?: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

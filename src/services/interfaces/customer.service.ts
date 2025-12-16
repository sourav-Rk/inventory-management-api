import { ICustomer } from "../../types/customer.types";

export interface ICustomerService {
  createCustomer(customer: ICustomer): Promise<ICustomer>;

  getAllCustomers(
    search?: string,
    page?: number,
    pageSize?: number
  ): Promise<{ data: ICustomer[]; total: number }>;

  getCustomerById(id: string): Promise<ICustomer | null>;

  updateCustomer(
    id: string,
    customer: Partial<ICustomer>
  ): Promise<ICustomer | null>;

  deleteCustomer(id: string): Promise<ICustomer | null>;

  searchCustomers(query: string): Promise<ICustomer[]>;
}

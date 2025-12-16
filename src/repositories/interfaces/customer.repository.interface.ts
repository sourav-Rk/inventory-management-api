import { ICustomer } from "../../types/customer.types";

export interface ICustomerRepository {
  create(customer: ICustomer): Promise<ICustomer>;
  findAll(): Promise<ICustomer[]>;
  findById(id: string): Promise<ICustomer | null>;
  update(id: string, customer: Partial<ICustomer>): Promise<ICustomer | null>;
  delete(id: string): Promise<ICustomer | null>;
  search(query: string): Promise<ICustomer[]>;
  findPaginated(
    search: string | undefined,
    page: number,
    pageSize: number
  ): Promise<{ data: ICustomer[]; total: number }>;
  totalCustomers () : Promise<number>
}

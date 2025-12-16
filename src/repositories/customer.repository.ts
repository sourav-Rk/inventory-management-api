import { CustomerModel } from "../models/customer.model";
import { ICustomerRepository } from "./interfaces/customer.repository.interface";
import { ICustomer } from "../types/customer.types";

export class CustomerRepository implements ICustomerRepository {
  async create(customer: ICustomer): Promise<ICustomer> {
    const newCustomer = await CustomerModel.create(customer);
    return newCustomer.toObject();
  }

  async findAll(): Promise<ICustomer[]> {
    return CustomerModel.find().sort({ createdAt: -1 });
  }

  async findPaginated(
    search: string | undefined,
    page: number,
    pageSize: number
  ): Promise<{ data: ICustomer[]; total: number }> {
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { mobile: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await CustomerModel.countDocuments(filter);
    const data = await CustomerModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { data, total };
  }

  async findById(id: string): Promise<ICustomer | null> {
    return CustomerModel.findById(id);
  }

  async update(id: string, customer: Partial<ICustomer>): Promise<ICustomer | null> {
    return CustomerModel.findByIdAndUpdate(id, customer, { new: true });
  }

  async delete(id: string): Promise<ICustomer | null> {
    return CustomerModel.findByIdAndDelete(id);
  }

  async search(query: string): Promise<ICustomer[]> {
    return CustomerModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { mobile: { $regex: query, $options: "i" } },
      ],
    });
  }

  async totalCustomers () : Promise<number>{
    return CustomerModel.find().countDocuments();
  }
}

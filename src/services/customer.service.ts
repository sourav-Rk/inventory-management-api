import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { ICustomerRepository } from "../repositories/interfaces/customer.repository.interface";
import { ICustomer } from "../types/customer.types";
import { AppError } from "../utils/AppError";
import { ICustomerService } from "./interfaces/customer.service";

export class CustomerService implements ICustomerService {
  private customerRepository: ICustomerRepository;

  constructor(customerRepository: ICustomerRepository) {
    this.customerRepository = customerRepository;
  }

  async createCustomer(customer: ICustomer): Promise<ICustomer> {
    return this.customerRepository.create(customer);
  }

  async getAllCustomers(
    search?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: ICustomer[]; total: number }> {
    return this.customerRepository.findPaginated(search, page, pageSize);
  }

  async getCustomerById(id: string): Promise<ICustomer | null> {
    const customerExist = await this.customerRepository.findById(id);

    if (!customerExist) {
      throw new AppError(
        MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return this.customerRepository.findById(id);
  }

  async updateCustomer(
    id: string,
    customer: Partial<ICustomer>
  ): Promise<ICustomer | null> {
    const customerExist = await this.customerRepository.findById(id);

    if (!customerExist) {
      throw new AppError(
        MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return this.customerRepository.update(id, customer);
  }

  async deleteCustomer(id: string): Promise<ICustomer | null> {
    const customerExist = await this.customerRepository.findById(id);

    if (!customerExist) {
      throw new AppError(
        MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return this.customerRepository.delete(id);
  }

  async searchCustomers(query: string): Promise<ICustomer[]> {
    return this.customerRepository.search(query);
  }
}

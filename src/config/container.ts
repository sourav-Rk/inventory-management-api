import { AuthController } from "../controllers/auth.controller";
import { CustomerController } from "../controllers/customer.controller";
import { ItemController } from "../controllers/item.controller";
import { ReportController } from "../controllers/report.controller";
import { SaleController } from "../controllers/sale.controller";
import { CustomerRepository } from "../repositories/customer.repository";
import { ItemRepository } from "../repositories/item.repository";
import { SaleRepository } from "../repositories/sale.repository";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { CustomerService } from "../services/customer.service";
import { ItemService } from "../services/item.service";
import { SaleService } from "../services/sale.service";
import { AuthRoutes } from "../routes/auth.routes";
import { ItemRoutes } from "../routes/item.routes";
import { CustomerRoutes } from "../routes/customer.routes";
import { ReportRoutes } from "../routes/report.routes";
import { SaleRoutes } from "../routes/sale.routes";
import { IReportService } from "../services/interfaces/report.service.interface";
import { ReportService } from "../services/report.service";
import { ICustomerRepository } from "../repositories/interfaces/customer.repository.interface";
import { IItemRepository } from "../repositories/interfaces/item.repository.interface";
import { ISaleRepository } from "../repositories/interfaces/sale.repository.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { IAuthService } from "../services/interfaces/auth.service.interface";
import { ICustomerService } from "../services/interfaces/customer.service";
import { IItemService } from "../services/interfaces/item.service.interface";
import { ISaleService } from "../services/interfaces/sale.service.interface";

class Container {
  // Repositories
  private _customerRepository: ICustomerRepository | null = null;
  private _itemRepository: IItemRepository | null = null;
  private _saleRepository: ISaleRepository | null = null;
  private _userRepository: IUserRepository | null = null;

  // Services

  private _authService: IAuthService | null = null;
  private _customerService: ICustomerService | null = null;
  private _itemService: IItemService | null = null;
  private _saleService: ISaleService | null = null;
  private _reportService: IReportService | null = null;

  // Controllers
  private _authController: AuthController | null = null;
  private _customerController: CustomerController | null = null;
  private _itemController: ItemController | null = null;
  private _reportController: ReportController | null = null;
  private _saleController: SaleController | null = null;

  //Routes
  private _authRouter: AuthRoutes | null = null;
  private _itemRouter: ItemRoutes | null = null;
  private _customerRouter: CustomerRoutes | null = null;
  private _reportRouter: ReportRoutes | null = null;
  private _salesRouter: SaleRoutes | null = null;

  // Repository Getters
  get userRepository(): IUserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository();
    }
    return this._userRepository;
  }

  get customerRepository(): ICustomerRepository {
    if (!this._customerRepository) {
      this._customerRepository = new CustomerRepository();
    }
    return this._customerRepository;
  }

  get itemRepository(): IItemRepository {
    if (!this._itemRepository) {
      this._itemRepository = new ItemRepository();
    }
    return this._itemRepository;
  }

  get saleRepository(): ISaleRepository {
    if (!this._saleRepository) {
      this._saleRepository = new SaleRepository();
    }
    return this._saleRepository;
  }

  // Service Getters
  get customerService(): ICustomerService {
    if (!this._customerService) {
      this._customerService = new CustomerService(this.customerRepository);
    }
    return this._customerService;
  }

  get authService(): IAuthService {
    if (!this._authService) {
      this._authService = new AuthService(this.userRepository);
    }
    return this._authService;
  }

  get itemService(): IItemService {
    if (!this._itemService) {
      this._itemService = new ItemService(this.itemRepository);
    }
    return this._itemService;
  }

  get saleService(): ISaleService {
    if (!this._saleService) {
      this._saleService = new SaleService(
        this.saleRepository,
        this.itemRepository,
        this.customerRepository
      );
    }

    return this._saleService;
  }

  get reportService(): IReportService {
    if (!this._reportService) {
      this._reportService = new ReportService(
        this.itemRepository,
        this.saleRepository,
        this.customerRepository
      );
    }
    return this._reportService;
  }

  // Controller Getters
  get authController(): AuthController {
    if (!this._authController) {
      this._authController = new AuthController(this.authService);
    }
    return this._authController;
  }

  get customerController(): CustomerController {
    if (!this._customerController) {
      this._customerController = new CustomerController(this.customerService);
    }
    return this._customerController;
  }

  get itemController(): ItemController {
    if (!this._itemController) {
      this._itemController = new ItemController(this.itemService);
    }
    return this._itemController;
  }

  get saleController(): SaleController {
    if (!this._saleController) {
      this._saleController = new SaleController(this.saleService);
    }
    return this._saleController;
  }

  get reportController(): ReportController {
    if (!this._reportController) {
      this._reportController = new ReportController(
        this.saleService,
        this.itemService,
        this.reportService
      );
    }
    return this._reportController;
  }

  get authRouter(): AuthRoutes {
    if (!this._authRouter) {
      this._authRouter = new AuthRoutes();
    }
    return this._authRouter;
  }

  get itemRouter(): ItemRoutes {
    if (!this._itemRouter) {
      this._itemRouter = new ItemRoutes();
    }

    return this._itemRouter;
  }

  get customerRouter(): CustomerRoutes {
    if (!this._customerRouter) {
      this._customerRouter = new CustomerRoutes();
    }
    return this._customerRouter;
  }

  get reportRouter(): ReportRoutes {
    if (!this._reportRouter) {
      this._reportRouter = new ReportRoutes();
    }
    return this._reportRouter;
  }

  get salesRouter(): SaleRoutes {
    if (!this._salesRouter) {
      this._salesRouter = new SaleRoutes();
    }
    return this._salesRouter;
  }
}

export const container = new Container();

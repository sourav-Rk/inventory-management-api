export interface ISale {
  _id?: string;
  item: string;
  customer?: string; 
  customerName?: string; 
  quantity: number;
  totalPrice: number;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}



export interface SaleReportRowDTO {
  date: string;
  item: string;
  quantity: number;
  totalPrice: number;
  customer: string;
}

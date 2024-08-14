import { OrderStatus } from '@prisma/orders';

type OrderItem = {
  name: string;
  price: number;
  productId: number;
  quantity: number;
};

export type OrderWithProduct = {
  id: string;
  totalAmount: number;
  totalItems: number;
  paid: boolean;
  paidAt: Date | null;
  status: OrderStatus;
  orderItem: Array<OrderItem>;
  createdAt: Date;
  updatedAt: Date;
};

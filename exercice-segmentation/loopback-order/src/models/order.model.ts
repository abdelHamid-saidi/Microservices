import {Entity, model, property} from '@loopback/repository';

@model()
export class Order extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  customer: string;

  @property({
    type: 'string',
    required: true,
  })
  bookTitle: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {}

export type OrderWithRelations = Order & OrderRelations;

import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Order} from '../models';
import {OrderRepository} from '../repositories';
import {publishMessage} from '../services/rabbitmq.publisher';

export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
  ) {}

  @post('/orders')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {
            title: 'NewOrder',
            exclude: ['id'],
          }),
        },
      },
    })
    order: Omit<Order, 'id'>,
  ): Promise<Order> {
    const created = await this.orderRepository.create(order);
    await publishMessage('order.created', {
      id: created.id,
      customer: created.customer,
      bookTitle: created.bookTitle,
      quantity: created.quantity,
    });
    return created;
  }

  @get('/orders')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Order) filter?: Filter<Order>): Promise<Order[]> {
    return this.orderRepository.find(filter);
  }
}

import {
  BindingScope,
  injectable,
  LifeCycleObserver,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Channel, ChannelModel} from 'amqplib';
import {OrderRepository} from '../repositories';
import {connectRabbit} from './rabbitmq.publisher';

const QUEUE = 'inventory.deleted';

@injectable({scope: BindingScope.SINGLETON})
export class RabbitmqConsumerService implements LifeCycleObserver {
  private connection?: ChannelModel;
  private channel?: Channel;

  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
  ) {}

  async start(): Promise<void> {
    this.connection = await connectRabbit();
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(QUEUE, {durable: true});

    await this.channel.consume(QUEUE, async msg => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString()) as {
          id?: string;
          title?: string;
        };
        console.log('Order a reçu la notification inventory.deleted:', payload);

        if (payload.title) {
          const related = await this.orderRepository.find({
            where: {bookTitle: payload.title},
          });
          for (const order of related) {
            await this.orderRepository.deleteById(order.id);
            console.log(
              `Commande ${order.id} supprimée (livre "${payload.title}" retiré de l'inventaire)`,
            );
          }
        }

        this.channel?.ack(msg);
      } catch (err) {
        console.error('Erreur traitement inventory.deleted:', err);
        this.channel?.nack(msg, false, false);
      }
    });

    console.log(`Order écoute la file RabbitMQ ${QUEUE}`);
  }

  async stop(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}

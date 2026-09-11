import {
  BindingScope,
  injectable,
  LifeCycleObserver,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Channel, ChannelModel} from 'amqplib';
import {PaymentRepository} from '../repositories';
import {connectRabbit} from './rabbitmq.connection';

const QUEUE = 'order.created';

@injectable({scope: BindingScope.SINGLETON})
export class RabbitmqConsumerService implements LifeCycleObserver {
  private connection?: ChannelModel;
  private channel?: Channel;

  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) {}

  async start(): Promise<void> {
    this.connection = await connectRabbit();
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(QUEUE, {durable: true});

    await this.channel.consume(QUEUE, async msg => {
      if (!msg) return;
      try {
        const order = JSON.parse(msg.content.toString()) as {
          id?: string;
          customer?: string;
          bookTitle?: string;
          quantity?: number;
        };
        console.log('Payment a reçu la notification order.created:', order);

        const payment = await this.paymentRepository.create({
          orderRef: order.id ?? 'unknown',
          amount: Number(order.quantity ?? 1) * 10,
          method: 'rabbitmq',
        });
        console.log('Paiement créé automatiquement:', payment);

        this.channel?.ack(msg);
      } catch (err) {
        console.error('Erreur traitement order.created:', err);
        this.channel?.nack(msg, false, false);
      }
    });

    console.log(`Payment écoute la file RabbitMQ ${QUEUE}`);
  }

  async stop(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}

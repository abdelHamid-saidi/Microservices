import amqp, {ChannelModel} from 'amqplib';

const RABBITMQ_URL =
  process.env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672';

export async function connectRabbit(): Promise<ChannelModel> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 20; attempt++) {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      console.log(`Connected to RabbitMQ (${RABBITMQ_URL})`);
      return connection;
    } catch (err) {
      lastError = err;
      console.log(`RabbitMQ not ready, retry ${attempt}/20...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw lastError;
}

export async function publishMessage(
  queue: string,
  payload: object,
): Promise<void> {
  const connection = await connectRabbit();
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, {durable: true});
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
  console.log(`Message published on ${queue}:`, payload);
  await channel.close();
  await connection.close();
}

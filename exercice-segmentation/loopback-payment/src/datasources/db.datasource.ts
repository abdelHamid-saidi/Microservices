import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'db',
  connector: 'mongodb',
  url: process.env.MONGODB_URL ?? 'mongodb://127.0.0.1:27017/payment',
  host: process.env.MONGODB_HOST ?? '127.0.0.1',
  port: +(process.env.MONGODB_PORT ?? 27017),
  user: process.env.MONGODB_USER ?? '',
  password: process.env.MONGODB_PASSWORD ?? '',
  database: process.env.MONGODB_DATABASE ?? 'payment',
  useNewUrlParser: true,
};

@lifeCycleObserver('datasource')
export class DbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = config,
  ) {
    const resolved = {
      ...config,
      ...dsConfig,
      url:
        process.env.MONGODB_URL ??
        (dsConfig as {url?: string}).url ??
        config.url,
    };
    super(resolved);
  }
}

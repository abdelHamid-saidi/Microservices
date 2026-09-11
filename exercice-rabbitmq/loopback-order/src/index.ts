import {ApplicationConfig, OrderApplication} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new OrderApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`LoopBack Order is running at ${url}`);
  console.log(`API Explorer: ${url}/explorer`);
  return app;
}

if (require.main === module) {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? 3001),
      host: process.env.HOST ?? '0.0.0.0',
      gracePeriodForClose: 5000,
      openApiSpec: {
        setServersFromRequest: true,
      },
      cors: {
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      },
    },
  };

  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}

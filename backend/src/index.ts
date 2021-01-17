import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

import Fastify from 'fastify';
import FastifyCookie from 'fastify-cookie';
import FastifySensible from 'fastify-sensible';
import FastifySession from 'fastify-session';
import database from './database/database';
import registerOAuth from './routes/oauth2';
import registerWebsiteApi from './routes/website-api';
import { parseIntStrict, requireEnv } from './utils';

const server = Fastify({
  logger: {
    level: 'info',
    prettyPrint: true,
  },
});

async function start() {
  await server.register(FastifySensible);
  await server.register(FastifyCookie);
  await server.register(FastifySession, {
    secret: requireEnv('SESSION_SECRET'),
    cookie: {
      secure: false, // TODO: Remove this line or add development env variable
    },
  });
  await server.register(registerOAuth, { prefix: '/api/oauth', logLevel: 'info' });
  await server.register(registerWebsiteApi, { prefix: '/api/website', logLevel: 'info' });

  await database.connect();
  server.log.info('Connected to database');

  const port = parseIntStrict(requireEnv('PORT'));
  await server.listen(port);
  server.log.info(`Listening on port ${port}`);
}

start()
  .catch((error) => {
    server.log.error(error);
    process.exit(1);
  });

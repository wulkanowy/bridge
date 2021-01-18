import { ApolloServer } from 'apollo-server-fastify';
import { buildSchema } from 'type-graphql';
import type { ApolloContext, MyFastifyInstance } from '../../types';
import { getSessionData } from '../../utils';
import LoginResolver from './resolvers/login-resolver';
import PromptInfoResolver from './resolvers/prompt-info-resolver';
import type { WebsiteAPIContext } from './types';

export default async function registerWebsiteApi(server: MyFastifyInstance): Promise<void> {
  const schema = await buildSchema({
    authMode: 'error',
    resolvers: [
      PromptInfoResolver,
      LoginResolver,
    ],
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ((context: ApolloContext): WebsiteAPIContext => ({
      ...context,
      sessionData: getSessionData(context.request.session),
    })),
  });
  await server.register(apolloServer.createHandler({
    cors: {
      origin: false,
    },
  }));
  console.log(apolloServer.graphqlPath);
}

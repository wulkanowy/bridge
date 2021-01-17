import { ApolloServer } from 'apollo-server-fastify';
import { buildSchema } from 'type-graphql';
import { ApolloContext, MyFastifyInstance } from '../../types';
import { getSessionData } from '../../utils';
import PromptInfoResolver from './resolvers/prompt-info-resolver';
import { WebsiteAPIContext } from './types';

export default async function registerWebsiteApi(server: MyFastifyInstance): Promise<void> {
  const schema = await buildSchema({
    authMode: 'error',
    resolvers: [PromptInfoResolver],
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
      origin: 'https://google.com',
    },
  }));
  console.log(apolloServer.graphqlPath);
}

import { ApolloServer } from 'apollo-server-fastify';
import { buildSchema } from 'type-graphql';
import type { ApolloContext, MyFastifyInstance } from '../../types';
import { getSessionData } from '../../utils';
import registerAllow from './allow';
import registerDeny from './deny';
import CreateUserResolver from './resolvers/authenticate-prompt/create-user-resolver';
import LoginResolver from './resolvers/authenticate-prompt/login-resolver';
import PromptInfoResolver from './resolvers/authenticate-prompt/prompt-info-resolver';
import SetSymbolResolver from './resolvers/authenticate-prompt/set-symbol-resolver';
import type { WebsiteAPIContext } from './types';

export default async function registerWebsiteApi(server: MyFastifyInstance): Promise<void> {
  const schema = await buildSchema({
    authMode: 'error',
    resolvers: [
      PromptInfoResolver,
      LoginResolver,
      SetSymbolResolver,
      CreateUserResolver,
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

  registerDeny(server);
  registerAllow(server);
}

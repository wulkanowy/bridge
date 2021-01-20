import { ApolloServer } from 'apollo-server-fastify';
import { buildSchema } from 'type-graphql';
import { ParamError } from '../../errors';
import type { ApolloContext, MyFastifyInstance } from '../../types';
import { getSessionData, isObject, validateParam } from '../../utils';
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

  server.get('/deny', async (
    request,
    reply,
  ) => {
    if (!isObject(request.query)) {
      server.log.warn('Request query is not an object');
      throw server.httpErrors.badRequest();
    }
    try {
      validateParam('prompt_id', request.query.prompt_id);
    } catch (error) {
      if (error instanceof ParamError) {
        throw server.httpErrors.badRequest(error.message);
      }
      server.log.error(error);
      throw server.httpErrors.internalServerError();
    }
    // TODO: Find why the promise never resolves
    reply.clearCookie(`epk-${request.query.prompt_id}`);
    // In case execution of setCookie takes some time
    // TODO: Remove
    await new Promise((resolve) => setTimeout(resolve, 100));

    const sessionData = getSessionData(request.session);
    const prompt = sessionData.prompts.get(request.query.prompt_id);
    if (!prompt) throw server.httpErrors.badRequest('Prompt data not found');
    await reply.redirect(`${prompt.redirectUri}?error=access_denied&error_description=${encodeURIComponent('User denied')}`);
    sessionData.prompts.delete(request.query.prompt_id);
  });
}

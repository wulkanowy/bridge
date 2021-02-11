import { URL } from 'url';
import { nanoid } from 'nanoid';
import { ParamError } from '../../../errors';
import type { MyFastifyInstance } from '../../../types';
import {
  getSessionData, isObject, requireEnv, validateParam,
} from '../../../utils';

export default function registerGitHubSignIn(server: MyFastifyInstance): void {
  server.get('/developer/sign-in/github', async (
    request,
    reply,
  ) => {
    if (!isObject(request.query)) {
      throw server.httpErrors.badRequest('Request query is not an object');
    }
    try {
      validateParam('return_to', request.query.return_to);
    } catch (error) {
      server.log.error(error);
      if (error instanceof ParamError) {
        throw server.httpErrors.badRequest(error.message);
      }
      throw server.httpErrors.internalServerError();
    }
    const sessionData = getSessionData(request.session);
    let state: string;
    do {
      state = nanoid();
    } while (sessionData.gitHubAuthorizations.has(state));
    const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
    authorizeUrl.searchParams.set('client_id', requireEnv('GITHUB_CLIENT_ID'));
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('redirect_uri', requireEnv('GITHUB_REDIRECT_URL'));
    authorizeUrl.searchParams.set('state', state);
    await reply.redirect(authorizeUrl.toString());
  });
}

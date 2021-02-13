import got from 'got';
import DeveloperEntity from '../../../database/entities/developer';
import { ParamError } from '../../../errors';
import { getViewer } from '../../../graphql/github/sdk';
import type SessionData from '../../../session-data';
import type { GitHubAuthorization, MyFastifyInstance } from '../../../types';
import {
  getSessionData, isObject, requireEnv, validateOptionalParam, validateParam,
} from '../../../utils';

function getAuthorization(sessionData: SessionData, state?: string): GitHubAuthorization | null {
  if (!state) return null;
  return sessionData.gitHubAuthorizations.get(state) ?? null;
}

export default function registerGitHubCallback(server: MyFastifyInstance): void {
  server.get('/developer/github-callback', async (
    request,
    reply,
  ) => {
    const sessionData = getSessionData(request.session);
    if (!isObject(request.query)) {
      throw server.httpErrors.badRequest('Request query is not an object');
    }
    try {
      validateOptionalParam('error', request.query.error);
      validateOptionalParam('state', request.query.state);
    } catch (error) {
      server.log.error(error);
      if (error instanceof ParamError) {
        throw server.httpErrors.badRequest(error.message);
      }
      throw server.httpErrors.internalServerError();
    }
    const authorization = getAuthorization(sessionData, request.query.state);
    if (request.query.error) {
      if (authorization && request.query.state) sessionData.gitHubAuthorizations.delete(request.query.state);
      if (request.query.error === 'access_denied') {
        await reply.redirect(authorization?.returnTo ?? '/');
      }
      throw server.httpErrors.internalServerError(`Got error response: "${request.query.error}"`);
    }
    if (!request.query.state) throw server.httpErrors.badRequest('Missing state param');
    if (!authorization) throw server.httpErrors.badRequest('Authorization not found');
    try {
      validateParam('code', request.query.code);
    } catch (error) {
      server.log.error(error);
      if (error instanceof ParamError) {
        throw server.httpErrors.badRequest(error.message);
      }
      throw server.httpErrors.internalServerError();
    }

    try {
      const response = await got.post<{
        token_type: string;
        access_token: string;
        scope: string;
      }>('https://github.com/login/oauth/access_token', {
        searchParams: {
          client_id: requireEnv('GITHUB_CLIENT_ID'),
          client_secret: requireEnv('GITHUB_CLIENT_SECRET'),
          code: request.query.code,
        },
        responseType: 'json',
      });
      const viewer = await getViewer(response.body.access_token, response.body.token_type);
      console.log(viewer);
      let developer = await DeveloperEntity.findOne({
        where: {
          gitHubId: viewer.id,
        },
      });
      if (!developer) {
        developer = new DeveloperEntity();
        developer.gitHubId = viewer.id;
      }
      developer.gitHubLogin = viewer.login;
      await developer.save();
      sessionData.loginState = {
        developerId: developer._id,
      };
      sessionData.gitHubAuthorizations.delete(request.query.state);
      await reply.redirect(authorization.returnTo);
    } catch (error) {
      server.log.error(error);
      throw server.httpErrors.internalServerError();
    }
  });
}

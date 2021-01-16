import _ from 'lodash';
import { nanoid } from 'nanoid';
import { scopes } from '../../constants';
import database from '../../database/database';
import { ParamError, ScopeError } from '../../errors';
import { MyFastifyInstance } from '../../types';
import {
  getSessionData, isObject, parseScopeParam, validateOptionalParam, validateParam,
} from '../../utils';

export default function registerAuthorize(server: MyFastifyInstance): void {
  server.post('/authorize', async (
    request,
    reply,
  ) => {
    console.log(request.query);
    if (!isObject(request.query)) {
      server.log.warn('Request query is not an object');
      throw server.httpErrors.badRequest();
    }
    server.log.info(JSON.stringify(request.body));
    try {
      validateParam('client_id', request.query.client_id);
      validateParam('redirect_uri', request.query.redirect_uri);
    } catch (error) {
      if (error instanceof ParamError) {
        throw server.httpErrors.badRequest(error.message);
      }
      server.log.error(error);
      throw server.httpErrors.internalServerError();
    }

    const application = await database.applicationRepo.findOne({
      where: {
        clientId: request.query.client_id,
      },
    });
    if (application === undefined) throw server.httpErrors.badRequest('Unknown application');
    if (!application.redirectUris.includes(request.query.redirect_uri)) throw server.httpErrors.badRequest('Redirect URI not registered');

    try {
      validateParam('response_type', request.query.response_type);
      if (request.query.response_type === 'code') {
        const requestedScopes = _.uniq(parseScopeParam('scope', request.query.scope));
        requestedScopes.forEach((scope) => {
          if (!scopes.includes(scope)) {
            throw new ScopeError(`Unknown scope ${scope}`);
          }
        });
        validateOptionalParam('state', request.query.state);
        validateOptionalParam('code_challenge', request.query.code_challenge);
        validateOptionalParam('code_challenge_method', request.query.code_challenge_method);

        const codeChallengeMethod = request.query.code_challenge_method ?? 'plain';
        if (codeChallengeMethod !== 'plain' && codeChallengeMethod !== 'S256') {
          await reply.redirect(`${request.query.redirect_uri}?error=invalid_request&error_description=${encodeURIComponent('code_challenge_method should be either plain or S256')}`);
          return;
        }

        const promptId = nanoid(12);

        const sessionData = getSessionData(request.session);
        sessionData.prompts.set(promptId, {
          clientId: request.query.client_id,
          redirectUri: request.query.redirect_uri,
          scopes,
          state: request.query.state,
          codeChallenge: request.query.code_challenge === undefined ? undefined : {
            method: codeChallengeMethod,
            value: request.query.code_challenge,
          },
        });

        await reply.redirect(`/authenticate-prompt?prompt_id=${promptId}`);
        return;
      }
      await reply.redirect(`${request.query.redirect_uri}?error=unsupported_response_type`);
      return;
    } catch (error) {
      if (error instanceof ParamError) {
        await reply.redirect(`${request.query.redirect_uri}?error=invalid_request&error_description=${encodeURIComponent(error.message)}`);
        return;
      }
      if (error instanceof ScopeError) {
        await reply.redirect(`${request.query.redirect_uri}?error=invalid_scope&error_description=${encodeURIComponent(error.message)}`);
        return;
      }
      server.log.error(error);
      await reply.redirect(`${request.query.redirect_uri}?error=server_error`);
    }
  });
}

import _ from 'lodash';
import { nanoid } from 'nanoid';
import urlJoin from 'url-join';
import { scopes, websitePrefix } from '../../constants';
import Client from '../../database/entities/client';
import { ParamError, ScopeError } from '../../errors';
import type { MyFastifyInstance, StudentsMode } from '../../types';

import {
  createKey,
  getSessionData, isObject, parseArrayParam, validateOptionalParam, validateParam,
} from '../../utils';

export default function registerAuthorize(server: MyFastifyInstance): void {
  server.get('/authorize', async (
    request,
    reply,
  ) => {
    if (!isObject(request.query)) {
      server.log.warn('Request query is not an object');
      await reply.redirect(urlJoin(
        websitePrefix,
        `/prompt-error?code=invalid_request&description=${
          encodeURIComponent('Request query is not an object')
        }`,
      ));
      return;
    }
    try {
      validateParam('client_id', request.query.client_id);
      validateParam('redirect_uri', request.query.redirect_uri);
    } catch (error) {
      if (error instanceof ParamError) {
        await reply.redirect(urlJoin(
          websitePrefix,
          `/prompt-error?code=invalid_request&description=${encodeURIComponent(error.message)}`,
        ));
        return;
      }
      server.log.error(error);
      await reply.redirect(urlJoin(websitePrefix, '/prompt-error?code=internal'));
      return;
    }

    const client = await Client.findOne({
      where: {
        clientId: request.query.client_id,
      },
    });
    if (client === undefined) {
      await reply.redirect(urlJoin(websitePrefix, '/prompt-error?code=unknown_application'));
      return;
    }
    if (!client.redirectUris.includes(request.query.redirect_uri)) {
      await reply.redirect(urlJoin(websitePrefix, '/prompt-error?code=unknown_redirect_uri'));
      return;
    }

    try {
      validateParam('response_type', request.query.response_type);
      if (request.query.response_type === 'code') {
        validateParam('students_mode', request.query.students_mode);
        validateOptionalParam('state', request.query.state);
        validateOptionalParam('code_challenge', request.query.code_challenge);
        validateOptionalParam('code_challenge_method', request.query.code_challenge_method);

        const codeChallengeMethod = request.query.code_challenge_method ?? 'plain';
        if (codeChallengeMethod !== 'plain' && codeChallengeMethod !== 'S256') {
          throw new ParamError('code_challenge_method should be either "plain" or "S256"');
        }

        if (
          !['none', 'one', 'many'].includes(request.query.students_mode)
        ) {
          throw new ParamError('students_mode should be either "none", "one" or "many"');
        }
        const studentsMode = request.query.students_mode as StudentsMode;

        const requestedScopes = _.uniq(parseArrayParam('scope', request.query.scope));
        requestedScopes.forEach((scope) => {
          if (!scopes.includes(scope)) {
            throw new ScopeError(`Unknown scope ${scope}`);
          }
        });
        // TODO: Check if user requests student scopes according to students_mode

        const promptId = nanoid(12);

        const sessionData = getSessionData(request.session);
        sessionData.authPrompts.set(promptId, {
          clientId: client.clientId,
          redirectUri: request.query.redirect_uri,
          scopes: requestedScopes,
          state: request.query.state,
          codeChallenge: request.query.code_challenge === undefined ? undefined : {
            method: codeChallengeMethod,
            value: request.query.code_challenge,
          },
          studentsMode,
          promptSecret: createKey(),
        });

        await reply.redirect(urlJoin(websitePrefix, `/authenticate-prompt?prompt_id=${promptId}`));
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

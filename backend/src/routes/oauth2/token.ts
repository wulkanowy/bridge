import type { FastifyReply } from 'fastify';
import { getCode, invalidateCode } from '../../codes';
import ClientEntity from '../../database/entities/client';
import TokenEntity from '../../database/entities/token';
import { ParamError } from '../../errors';
import type { CodeInfo, MyFastifyInstance, TokenContent } from '../../types';

import {
  encryptSymmetrical,
  isObject, sha256, validateParam,
} from '../../utils';

type TokenError = 'invalid_request'
| 'invalid_client'
| 'invalid_grant'
| 'invalid_scope'
| 'unauthorized_client'
| 'unsupported_grant_type'
| 'server_error';

async function sendCustomError(reply: FastifyReply, error: TokenError, description: string, statusCode = 400) {
  await reply.code(statusCode).send({
    status_code: statusCode,
    error,
    error_description: description,
  });
}

export default function registerToken(server: MyFastifyInstance): void {
  server.post('/token', async (
    request,
    reply,
  ) => {
    try {
      // TODO: Find why the promise never resolves
      reply.header('Cache-Control', 'no-store');
      reply.header('Pragma', 'no-cache');
      if (!isObject(request.body)) {
        await sendCustomError(reply, 'invalid_request', 'Cannot parse request');
        return;
      }
      validateParam('grant_type', request.body.grant_type);
      if (request.body.grant_type !== 'authorization_code') {
        await sendCustomError(reply, 'unsupported_grant_type', 'Grant type should be "authorization_code"');
        return;
      }
      validateParam('code', request.body.code);
      validateParam('redirect_uri', request.body.redirect_uri);
      validateParam('client_id', request.body.client_id);
      let codeInfo: CodeInfo;
      let tokenKey: string;
      try {
        const code = getCode(request.body.code);
        codeInfo = code.info;
        tokenKey = code.content.tk;
      } catch (error) {
        await sendCustomError(reply, 'invalid_grant', 'Code is invalid or expired');
        return;
      }

      if (codeInfo.clientId !== request.body.client_id) {
        await sendCustomError(reply, 'invalid_client', '"client_id" param is different from the one used in authorize request', 401);
        return;
      }
      if (codeInfo.redirectUri !== request.body.redirect_uri) {
        await sendCustomError(reply, 'invalid_grant', '"redirect_uri" param is different from the one used in authorize request');
        return;
      }

      const client = await ClientEntity.findOne({
        where: {
          clientId: request.body.client_id,
        },
      });
      if (!client) {
        await sendCustomError(reply, 'invalid_client', 'Client id not found', 401);
        return;
      }

      if (codeInfo.codeChallenge) {
        validateParam('code_verifier', request.body.code_verifier);
        if (
          codeInfo.codeChallenge.method === 'plain'
          && request.body.code_verifier !== codeInfo.codeChallenge.value
        ) {
          await sendCustomError(reply, 'invalid_grant', 'Invalid code verifier');
          return;
        }
        if (
          codeInfo.codeChallenge.method === 'S256'
          && sha256(request.body.code_verifier) !== codeInfo.codeChallenge.value
        ) {
          console.log(sha256(request.body.code_verifier), codeInfo.codeChallenge.value);
          await sendCustomError(reply, 'invalid_grant', 'Invalid code verifier');
          return;
        }
      } else {
        validateParam('client_secret', request.body.client_secret);
        if (client.clientSecret !== request.body.client_secret) {
          await sendCustomError(reply, 'invalid_client', 'Invalid client secret', 401);
          return;
        }
      }

      const tokenId = TokenEntity.generateTokenId();

      const token = new TokenEntity();
      token.tokenId = tokenId;
      token.creationDate = new Date();
      token.clientId = codeInfo.clientId;
      token.scopes = codeInfo.scopes;
      token.studentIds = codeInfo.studentIds;
      token.tokenSecret = codeInfo.tokenSecret;
      token.userId = codeInfo.userId;
      token.encryptedPassword = codeInfo.encryptedPassword;
      token.encryptedPrivateKey = codeInfo.encryptedPrivateKey;
      token.encryptedSDK = codeInfo.encryptedSDK;
      token.publicKey = codeInfo.publicKey;

      await token.save();

      const content: TokenContent = {
        tk: tokenKey,
      };

      invalidateCode(codeInfo.id);
      await reply.code(200).send({
        access_token: `${tokenId}~${encryptSymmetrical(JSON.stringify(content), codeInfo.tokenSecret)}`,
        token_type: 'bearer',
        scope: codeInfo.scopes.join(' '),
      });
      return;
    } catch (error) {
      if (error instanceof ParamError) {
        await sendCustomError(reply, 'invalid_request', error.message);
        return;
      }
      console.log(error);
      await sendCustomError(reply, 'server_error', 'An internal error occurred', 500);
    }
  });
}

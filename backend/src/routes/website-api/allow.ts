import { URL } from 'url';
import { createCode } from '../../codes';
import { ParamError } from '../../errors';
import type { MyFastifyInstance, SerializedSDK } from '../../types';
import { StudentsMode } from '../../types';
import {
  decryptSymmetrical, encryptSymmetrical,
  getSessionData, isObject, parseArrayParam, parseIntStrict, validateParam,
} from '../../utils';

export default function registerAllow(server: MyFastifyInstance): void {
  server.get('/allow', async (
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
    const encryptedTokenKey: string | undefined = request.cookies[`etk-${request.query.prompt_id}`];
    if (!encryptedTokenKey) throw server.httpErrors.badRequest('Missing etk cookie');

    const sessionData = getSessionData(request.session);
    const prompt = sessionData.prompts.get(request.query.prompt_id);
    if (!prompt) throw server.httpErrors.badRequest('Prompt data not found');
    if (!prompt.loginInfo) throw server.httpErrors.badRequest('Login data not provided');

    const tokenKey = decryptSymmetrical(encryptedTokenKey, prompt.promptSecret);
    const serializedSDK = JSON.parse(decryptSymmetrical(prompt.loginInfo.encryptedSDK, tokenKey)) as SerializedSDK;

    let studentIds: number[] = [];
    if (prompt.studentsMode !== StudentsMode.None) {
      try {
        studentIds = parseArrayParam('student_ids', request.query.student_ids).map(parseIntStrict);
        if (studentIds.length === 0) throw new ParamError('student_ids should not be empty');
      } catch (error) {
        if (error instanceof ParamError) {
          throw server.httpErrors.badRequest(error.message);
        }
        server.log.error(error);
        throw server.httpErrors.internalServerError();
      }
    }

    const newSerializedSDK: SerializedSDK = {
      client: serializedSDK.client,
      diaries: serializedSDK.diaries.filter((diary) => studentIds.includes(diary.info.studentId)),
    };
    const newEncryptedSDK = encryptSymmetrical(JSON.stringify(newSerializedSDK), tokenKey);

    const code = createCode({
      studentIds,
      scopes: prompt.scopes,
      clientId: prompt.clientId,
      publicKey: prompt.loginInfo.publicKey,
      encryptedSDK: newEncryptedSDK,
      encryptedPassword: prompt.loginInfo.encryptedPassword,
      encryptedPrivateKey: prompt.loginInfo.encryptedPrivateKey,
      tokenKey,
      codeChallenge: prompt.codeChallenge,
      redirectUri: prompt.redirectUri,
    });

    // TODO: Find why the promise never resolves
    reply.clearCookie(`etk-${request.query.prompt_id}`);
    // In case execution of setCookie takes some time
    // TODO: Remove
    await new Promise((resolve) => setTimeout(resolve, 100));
    const redirectUri = new URL(prompt.redirectUri);
    redirectUri.searchParams.set('code', code);
    if (prompt.state) redirectUri.searchParams.set('state', prompt.state);
    await reply.redirect(redirectUri.toString());
    sessionData.prompts.delete(request.query.prompt_id);
  });
}

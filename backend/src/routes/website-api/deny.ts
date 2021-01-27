import { ParamError } from '../../errors';
import type { MyFastifyInstance } from '../../types';
import { getSessionData, isObject, validateParam } from '../../utils';

export default function registerDeny(server: MyFastifyInstance): void {
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
    const prompt = sessionData.authPrompts.get(request.query.prompt_id);
    if (!prompt) throw server.httpErrors.badRequest('Prompt data not found');
    await reply.redirect(`${prompt.redirectUri}?error=access_denied&error_description=${encodeURIComponent('User denied')}`);
    sessionData.authPrompts.delete(request.query.prompt_id);
  });
}

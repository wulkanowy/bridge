import type { MyFastifyInstance } from '../../../types';
import { getSessionData } from '../../../utils';

export default function registerSignOut(server: MyFastifyInstance): void {
  server.get('/developer/sign-out', async (
    request,
    reply,
  ) => {
    const sessionData = getSessionData(request.session);
    sessionData.loginState = null;
    await reply.redirect('/developer');
  });
}

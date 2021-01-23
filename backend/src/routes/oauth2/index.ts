import type {
  MyFastifyInstance,
} from '../../types';
import registerAuthorize from './authorize';
import registerToken from './token';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function registerOAuth(server: MyFastifyInstance): Promise<void> {
  registerAuthorize(server);
  registerToken(server);
}

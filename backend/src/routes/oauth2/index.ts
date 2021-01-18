import type {
  MyFastifyInstance,
} from '../../types';
import registerAuthorize from './authorize';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function registerOAuth(server: MyFastifyInstance): Promise<void> {
  registerAuthorize(server);
}

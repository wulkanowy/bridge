import type SessionData from '../../session-data';
import type { ApolloContext } from '../../types';

export interface WebsiteAPIContext extends ApolloContext {
  sessionData: SessionData;
}

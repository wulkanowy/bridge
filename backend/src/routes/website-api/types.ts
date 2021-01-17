import { ApolloContext, SessionData } from '../../types';

export interface WebsiteAPIContext extends ApolloContext {
  sessionData: SessionData;
}

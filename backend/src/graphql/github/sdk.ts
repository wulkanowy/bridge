import { GraphQLClient } from 'graphql-request';
import { requireEnv } from '../../utils';
import type { GetUserQueryResult, User } from './queries/get-user';
import { getUserQuery } from './queries/get-user';
import type { GetViewerQueryResult, Viewer } from './queries/get-viewer';
import { getViewerQuery } from './queries/get-viewer';

const client = new GraphQLClient('https://api.github.com/graphql');

export async function getUser(login: string): Promise<User> {
  const { user } = await client.request<GetUserQueryResult>(getUserQuery, {
    login,
  }, {
    Authorization: `bearer ${requireEnv('GITHUB_API_TOKEN')}`,
  });
  return user;
}

export async function getViewer(accessToken: string, tokenType: string): Promise<Viewer> {
  const { viewer } = await client.request<GetViewerQueryResult>(getViewerQuery, {}, {
    Authorization: `${tokenType} ${accessToken}`,
  });
  return viewer;
}

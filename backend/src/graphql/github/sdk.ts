import { GraphQLClient } from 'graphql-request';
import { requireEnv } from '../../utils';
import type { GetUserQueryResult, User } from './queries/get-user';
import { getUserQuery } from './queries/get-user';

const client = new GraphQLClient('https://api.github.com/graphql');
client.setHeader('Authorization', `bearer ${requireEnv('GITHUB_API_TOKEN')}`);

export async function getUser(login: string): Promise<User> {
  const { user } = await client.request<GetUserQueryResult>(getUserQuery, {
    login,
  });
  return user;
}

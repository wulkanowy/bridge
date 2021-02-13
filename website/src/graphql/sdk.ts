import { ClientError, GraphQLClient } from 'graphql-request';
import { getSdk } from '@/graphql/generated';
import { GraphQLError } from 'graphql-request/dist/types';

const client = new GraphQLClient('/api/website/graphql');
export const sdk = getSdk(client);

export interface GraphQLErrorFull extends GraphQLError {
  extensions?: {
    code?: string;
  };
}

export function hasErrorCode(error: unknown, code: string): boolean {
  if (!(error instanceof ClientError)) return false;
  return error.response.errors
    ?.some((resError: GraphQLErrorFull) => resError.extensions?.code === code) ?? false;
}

import { ApolloError } from 'apollo-server-fastify';

export class UnknownPromptError extends Error {
  public name = 'UnknownPromptError';

  public constructor() {
    super('Unknown prompt');
  }
}

export class InvalidVulcanCredentialsError extends ApolloError {
  public name = 'InvalidVulcanCredentialsError';

  public constructor() {
    super('Invalid vulcan credentials', 'INVALID_VULCAN_CREDENTIALS');
  }
}

import { ApolloError } from 'apollo-server-fastify';

export class CaptchaError extends ApolloError {
  public name = 'CaptchaError';

  public constructor() {
    super('Captcha validation failed', 'CAPTCHA_ERROR');
  }
}

export class UnknownPromptError extends ApolloError {
  public name = 'UnknownPromptError';

  public constructor() {
    super('Unknown prompt', 'UNKNOWN_PROMPT_ERROR');
  }
}

export class InvalidVulcanCredentialsError extends ApolloError {
  public name = 'InvalidVulcanCredentialsError';

  public constructor() {
    super('Invalid vulcan credentials', 'INVALID_VULCAN_CREDENTIALS');
  }
}

export class InvalidSymbolError extends ApolloError {
  public name = 'InvalidSymbolError';

  public constructor() {
    super('Invalid symbol', 'INVALID_SYMBOL');
  }
}

export class ApplicationNotFoundError extends ApolloError {
  public name = 'ApplicationNotFoundError';

  public constructor() {
    super('Application not found', 'APPLICATION_NOT_FOUND_ERROR');
  }
}

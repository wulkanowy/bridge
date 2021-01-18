export class UnknownPromptError extends Error {
  public name = 'UnknownPromptError';

  public constructor() {
    super('Unknown prompt');
  }
}

export class InvalidCredentialsError extends Error {
  public name = 'InvalidCredentialsError';

  public constructor() {
    super('User with provided credentials not found');
  }
}

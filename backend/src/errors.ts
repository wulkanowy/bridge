export class ParamError extends Error {
  public name = 'ParamError';
}

export class ScopeError extends Error {
  public name = 'ScopeError';
}

export class UnknownCodeError extends Error {
  public name = 'UnknownCodeError';

  public constructor() {
    super('Authorization code is invalid or expired');
  }
}

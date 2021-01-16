import {
  FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault,
} from 'fastify';

export interface Prompt {
  clientId: string;
  redirectUri: string;
  scopes: string[],
  state?: string;
  codeChallenge?: {
    value: string;
    method: 'plain' | 'S256';
  };
}

export interface SessionData {
  prompts: Map<string, Prompt>
}

export interface Session {
  sessionId: string;
  encryptedSessionId: string;
  touch(): void;
  regenerate(): void;
  data?: SessionData;
}

export type MyFastifyInstance = FastifyInstance<RawServerDefault, RawRequestDefaultExpression<RawServerDefault>, RawReplyDefaultExpression<RawServerDefault>>;

import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify';
import { registerEnumType } from 'type-graphql';
import type SessionData from './session-data';

export enum StudentsMode {
  None = 'none',
  One = 'one',
  Many = 'many',
}

registerEnumType(StudentsMode, {
  name: 'StudentsMode',
});

export interface Prompt {
  clientId: string;
  redirectUri: string;
  scopes: string[],
  state?: string;
  codeChallenge?: {
    value: string;
    method: 'plain' | 'S256';
  };
  studentsMode: StudentsMode;
  promptSecret: Buffer;
  loginInfo?: {
    host: string;
    username: string;
    encryptedPassword: string;
    availableStudentIds: number[];
  };
}

export interface Session {
  sessionId: string;
  encryptedSessionId: string;
  touch(): void;
  regenerate(): void;
  data?: SessionData;
}

export type MyFastifyInstance = FastifyInstance<RawServerDefault, RawRequestDefaultExpression<RawServerDefault>, RawReplyDefaultExpression<RawServerDefault>>;

export interface ApolloContext {
  request: FastifyRequest;
  reply: FastifyReply,
}

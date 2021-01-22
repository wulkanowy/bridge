import type { SerializedClient } from '@wulkanowy/sdk/dist/diary/interfaces/serialized-client';
import type { SerializedDiary } from '@wulkanowy/sdk/dist/diary/interfaces/serialized-diary';
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
    encryptedSDK: string;
    publicKey: string;
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

export interface SerializedSDK {
  client: SerializedClient;
  diaries: SerializedDiary[];
}

export type MyFastifyInstance = FastifyInstance<RawServerDefault, RawRequestDefaultExpression<RawServerDefault>, RawReplyDefaultExpression<RawServerDefault>>;

export interface ApolloContext {
  request: FastifyRequest;
  reply: FastifyReply,
}

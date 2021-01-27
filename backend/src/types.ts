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
import type { ObjectID } from 'typeorm';
import type SessionData from './session-data';

export enum StudentsMode {
  None = 'none',
  One = 'one',
  Many = 'many',
}

registerEnumType(StudentsMode, {
  name: 'StudentsMode',
});

export interface CodeChallenge {
  value: string;
  method: 'plain' | 'S256';
}

export interface AuthPrompt {
  clientId: string;
  redirectUri: string;
  scopes: string[],
  state?: string;
  codeChallenge?: CodeChallenge;
  studentsMode: StudentsMode;
  promptSecret: string;
  loginInfo?: {
    host: string;
    username: string;
    encryptedPassword: string;
    encryptedPrivateKey: string;
    publicKey: string;
    encryptedClient: string;
    symbolInfo?: {
      symbol: string;
      encryptedDiaries: string;
      availableStudentIds: number[];
      loginIds: string[];
      userId?: ObjectID,
    }
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

export interface CodeInfo {
  id: string;
  expires: Date;
  scopes: string[];
  clientId: string;
  userId: ObjectID,
  studentIds: number[];
  tokenSecret: string;
  publicKey: string;
  encryptedPassword: string;
  encryptedSDK: string;
  encryptedPrivateKey: string;
  codeChallenge?: CodeChallenge;
  redirectUri: string;
}

export interface CodeContent {
  tk: string;
}

export interface TokenContent {
  tk: string;
}

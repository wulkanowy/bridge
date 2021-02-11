import { addSeconds, isAfter } from 'date-fns';
import type { FastifyLoggerInstance } from 'fastify';
import { nanoid } from 'nanoid';
import type { ObjectID } from 'typeorm';
import { UnknownCodeError } from './errors';
import type { CodeChallenge, CodeContent, CodeInfo } from './types';
import { createKey, decryptSymmetrical, encryptSymmetrical } from './utils';

const codes = new Map<string, CodeInfo>();

export function createCode(options: {
  clientId: string;
  scopes: string[];
  studentIds: number[];
  userId: ObjectID;
  publicKey: string;
  tokenKey: string;
  encryptedPrivateKey: string;
  encryptedPassword: string;
  encryptedSDK: string;
  codeChallenge?: CodeChallenge;
  redirectUri: string;
}): string {
  const expires = addSeconds(new Date(), 60);
  const tokenSecret = createKey();
  let id: string;
  do {
    id = nanoid();
  } while (codes.has(id));
  codes.set(id, {
    expires,
    id,
    clientId: options.clientId,
    userId: options.userId,
    scopes: options.scopes,
    studentIds: options.studentIds,
    publicKey: options.publicKey,
    encryptedPrivateKey: options.encryptedPrivateKey,
    encryptedSDK: options.encryptedSDK,
    encryptedPassword: options.encryptedPassword,
    tokenSecret,
    codeChallenge: options.codeChallenge,
    redirectUri: options.redirectUri,
  });
  const content: CodeContent = {
    tk: options.tokenKey,
  };
  return `${id}~${encryptSymmetrical(JSON.stringify(content), tokenSecret)}`;
}

export function cleanUpCodes(logger: FastifyLoggerInstance): void {
  codes.forEach((code) => {
    if (isAfter(new Date(), code.expires)) {
      codes.delete(code.id);
      logger.info(`Code ${code.id} expired`);
    }
  });
}

export function getCode(code: string): {
  info: CodeInfo,
  content: CodeContent,
} {
  const [id, encryptedContent] = code.split('~');
  const info = codes.get(id);
  if (!info) throw new UnknownCodeError();
  if (isAfter(new Date(), info.expires)) {
    codes.delete(id);
    throw new UnknownCodeError();
  }
  const content = JSON.parse(decryptSymmetrical(encryptedContent, info.tokenSecret)) as CodeContent;
  return { info, content };
}

export function invalidateCode(id: string): void {
  codes.delete(id);
}

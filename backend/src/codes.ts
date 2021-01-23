import { addSeconds, isAfter } from 'date-fns';
import type { FastifyLoggerInstance } from 'fastify';
import { nanoid } from 'nanoid';
import type { CodeChallenge, CodeContent, CodeInfo } from './types';
import { createKey, encryptSymmetrical } from './utils';

const codes = new Map<string, CodeInfo>();

export function createCode(options: {
  clientId: string;
  scopes: string[];
  studentIds: number[];
  publicKey: string;
  tokenKey: string;
  encryptedPrivateKey: string;
  encryptedPassword: string;
  encryptedSDK: string;
  codeChallenge?: CodeChallenge
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
    scopes: options.scopes,
    studentIds: options.studentIds,
    publicKey: options.publicKey,
    encryptedPrivateKey: options.encryptedPrivateKey,
    encryptedSDK: options.encryptedSDK,
    encryptedPassword: options.encryptedPassword,
    tokenSecret,
    codeChallenge: options.codeChallenge,
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

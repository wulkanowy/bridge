import got from 'got';
import _ from 'lodash';
import { ParamError } from '../errors';
import SessionData from '../session-data';
import type { Session } from '../types';

export * from './crypto';

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) throw new Error(`Environment variable ${name} not set`);
  return value;
}

export function requireEnvBase64(name: string): Buffer {
  return Buffer.from(requireEnv(name), 'base64');
}

export function parseIntStrict(value: string, radix = 10): number {
  const number = parseInt(value, radix);
  if (_.isNaN(number)) throw new Error(`Cannot parse ${value} to int`);
  return number;
}

export function parseFloatStrict(value: string): number {
  const number = parseFloat(value);
  if (_.isNaN(number)) throw new Error(`Cannot parse ${value} to float`);
  return number;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function validateParam(key: string, value: unknown): asserts value is string {
  if (value === undefined) throw new ParamError(`${key} param is missing`);
  if (typeof value !== 'string') throw new ParamError(`${key} param should be a string`);
}

export function validateOptionalParam(key: string, value: unknown): asserts value is string | undefined {
  if (value === undefined) return;
  if (typeof value !== 'string') throw new ParamError(`${key} param should be a string`);
}

export function parseScopeParam(key: string, value: unknown): string[] {
  if (value === undefined) throw new ParamError(`${key} param is missing`);
  if (typeof value === 'string') {
    if (value === '') return [];
    return value.split('+').map((scope) => scope.trim());
  }
  if (_.isArray(value)) return value.flatMap((e) => parseScopeParam(key, e));
  throw new ParamError(`${key} param should be a string or an array of strings`);
}

export function getSessionData(session: Session): SessionData {
  if (session.data === undefined) {
    // eslint-disable-next-line no-param-reassign
    session.data = new SessionData();
  }
  return session.data;
}

export async function verifyCaptchaResponse(response: string): Promise<boolean> {
  const { body } = await got.post<{
    success: boolean,
    challenge_ts?: string;
    hostname?: string;
    'error-codes'?: string[]
  }>('https://www.google.com/recaptcha/api/siteverify', {
    responseType: 'json',
    searchParams: {
      secret: requireEnv('CAPTCHA_SECRET'),
      response,
    },
  });
  console.log(body);
  return body.success;
}

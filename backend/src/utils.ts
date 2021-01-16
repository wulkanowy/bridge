import _ from 'lodash';
import { ParamError } from './errors';
import { Prompt, Session, SessionData } from './types';

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) throw new Error(`Environment variable ${name} not set`);
  return value;
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
    session.data = {
      prompts: new Map<string, Prompt>(),
    };
  }
  return session.data;
}

import type { Prompt } from './types';

export default class SessionData {
  public prompts = new Map<string, Prompt>();
}

import type { AuthPrompt } from './types';

export default class SessionData {
  public authPrompts = new Map<string, AuthPrompt>();
}

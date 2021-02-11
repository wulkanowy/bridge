import type { AuthPrompt, GitHubAuthorization } from './types';

export default class SessionData {
  public authPrompts = new Map<string, AuthPrompt>();

  public gitHubAuthorizations = new Map<string, GitHubAuthorization>();
}

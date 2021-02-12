/* eslint-disable class-methods-use-this */
import { Ctx, Query, Resolver } from 'type-graphql';
import Developer from '../../../../database/entities/developer';
import { getUser } from '../../../../graphql/github/sdk';
import LoginState from '../../models/login-state';
import type { WebsiteAPIContext } from '../../types';

@Resolver(LoginState)
export default class LoginStateResolver {
  @Query(() => LoginState, {
    nullable: true,
  })
  public async loginState(
    @Ctx() { sessionData }: WebsiteAPIContext,
  ): Promise<LoginState | null> {
    if (!sessionData.loginState) return null;
    const developer = await Developer.findOne(sessionData.loginState.developerId);
    if (!developer) {
      console.error('Developer not found');
      // eslint-disable-next-line no-param-reassign
      sessionData.loginState = null;
      return null;
    }
    const gitHubUser = await getUser(developer.gitHubLogin);
    return {
      login: gitHubUser.login,
      name: gitHubUser.name,
      avatarUrl: gitHubUser.avatarUrl,
    };
  }
}

/* eslint-disable class-methods-use-this */
import type { ResolverInterface } from 'type-graphql';
import {
  Arg, Ctx, FieldResolver, Query, Resolver, Root,
} from 'type-graphql';
import database from '../../../../database/database';
import { getUser } from '../../../../graphql/github/sdk';
import { UnknownPromptError } from '../../errors';
import PromptInfo from '../../models/prompt-info';
import type PromptInfoApplication from '../../models/prompt-info-application';
import type { WebsiteAPIContext } from '../../types';

@Resolver(PromptInfo)
export default class PromptInfoResolver implements ResolverInterface<PromptInfo> {
  @Query(() => PromptInfo)
  public promptInfo(
    @Arg('promptId') promptId: string,
      @Ctx() { sessionData }: WebsiteAPIContext,
  ): Partial<PromptInfo> {
    const prompt = sessionData.authPrompts.get(promptId);
    if (!prompt) throw new UnknownPromptError();
    return {
      id: promptId,
      clientId: prompt.clientId,
      scopes: prompt.scopes,
      studentsMode: prompt.studentsMode,
    };
  }

  @FieldResolver()
  public async application(@Root() prompt: PromptInfo): Promise<PromptInfoApplication> {
    const application = await database.applicationRepo.findOne({
      where: {
        clientId: prompt.clientId,
      },
    });
    if (!application) throw new Error('Prompt data not found');
    return {
      name: application.name,
      iconUrl: application.iconUrl,
      iconColor: application.iconColor,
      verified: application.verified,
      homepage: application.homepage,
      owner: await getUser(application.ownerGitHubLogin),
    };
  }
}

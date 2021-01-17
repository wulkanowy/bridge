/* eslint-disable class-methods-use-this */
import {
  Arg, Ctx, FieldResolver, Query, Resolver, ResolverInterface, Root,
} from 'type-graphql';
import database from '../../../database/database';
import PromptInfo from '../models/prompt-info';
import PromptInfoApplication from '../models/prompt-info-application';
import { WebsiteAPIContext } from '../types';

@Resolver(PromptInfo)
export default class PromptInfoResolver implements ResolverInterface<PromptInfo> {
  @Query(() => PromptInfo)
  public promptInfo(
    @Arg('id') id: string,
      @Ctx() { sessionData }: WebsiteAPIContext,
  ): Partial<PromptInfo> {
    const prompt = sessionData.prompts.get(id);
    if (!prompt) throw new Error('Prompt data not found');
    return {
      id,
      clientId: prompt.clientId,
      scopes: prompt.scopes,
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
      verified: application.verified,
    };
  }
}

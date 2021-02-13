/* eslint-disable class-methods-use-this */
import { ApolloError } from 'apollo-server-fastify';
import {
  Arg, Ctx, Query, Resolver,
} from 'type-graphql';
import ApplicationEntity from '../../../../database/entities/application';
import ClientEntity from '../../../../database/entities/client';
import DeveloperEntity from '../../../../database/entities/developer';
import { getUser } from '../../../../graphql/github/sdk';
import { UnknownPromptError } from '../../errors';
import PromptInfo from '../../models/prompt-info';
import type { WebsiteAPIContext } from '../../types';

@Resolver(PromptInfo)
export default class PromptInfoResolver {
  @Query(() => PromptInfo)
  public async promptInfo(
    @Arg('promptId') promptId: string,
      @Ctx() { sessionData }: WebsiteAPIContext,
  ): Promise<Partial<PromptInfo>> {
    const prompt = sessionData.authPrompts.get(promptId);
    if (!prompt) throw new UnknownPromptError();
    const client = await ClientEntity.findOne({
      where: {
        clientId: prompt.clientId,
      },
    });
    if (!client) throw new ApolloError('Client not found');
    const application = await ApplicationEntity.findOne(client.applicationId);
    if (!application) throw new ApolloError('Application not found');
    const developer = await DeveloperEntity.findOne(application.developerId);
    if (!developer) throw new ApolloError('Developer not found');
    return {
      id: promptId,
      scopes: prompt.scopes,
      studentsMode: prompt.studentsMode,
      application: {
        name: application.name,
        iconUrl: application.iconUrl,
        iconColor: application.iconColor,
        verified: application.verified,
        homepage: application.homepage,
        developer: await getUser(developer.gitHubLogin),
      },
    };
  }
}

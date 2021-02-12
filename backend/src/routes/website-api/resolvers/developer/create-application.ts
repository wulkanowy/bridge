/* eslint-disable class-methods-use-this */
import { UserInputError } from 'apollo-server-fastify';
import {
  Arg, Ctx, Mutation, Resolver, UnauthorizedError,
} from 'type-graphql';
import Application from '../../../../database/entities/application';
import ApplicationInfo from '../../models/application-info';
import type { WebsiteAPIContext } from '../../types';

@Resolver(() => ApplicationInfo)
export default class CreateApplicationResolver {
  @Mutation(() => ApplicationInfo)
  public async createApplication(
    @Arg('name') name: string,
      @Ctx() { sessionData }: WebsiteAPIContext,
  ): Promise<ApplicationInfo> {
    if (!sessionData.loginState) throw new UnauthorizedError();
    if (name !== name.trim()) throw new UserInputError('Name should be trimmed');
    if (name.trim().length < 3) throw new UserInputError('Name is too short');
    if (name.trim().length > 32) throw new UserInputError('Name is too long');

    const application = new Application();
    application.developerId = sessionData.loginState.developerId;
    application.homepage = null;
    application.verified = false;
    application.iconUrl = null;
    application.iconColor = '#444444';
    application.name = name;
    await application.save();

    return {
      id: application._id.toHexString(),
    };
  }
}

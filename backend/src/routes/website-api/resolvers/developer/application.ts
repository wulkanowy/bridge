/* eslint-disable class-methods-use-this */
import { UserInputError } from 'apollo-server-fastify';
import {
  Arg, Ctx, Mutation, Query, Resolver, UnauthorizedError,
} from 'type-graphql';
import ApplicationEntity from '../../../../database/entities/application';
import Application from '../../models/application';
import type { WebsiteAPIContext } from '../../types';

@Resolver()
export default class ApplicationResolver {
  @Mutation(() => Application)
  public async createApplication(
    @Arg('name') name: string,
      @Ctx() { sessionData }: WebsiteAPIContext,
  ): Promise<Application> {
    if (!sessionData.loginState) throw new UnauthorizedError();
    if (name !== name.trim()) throw new UserInputError('Name should be trimmed');
    if (name.trim().length < 3) throw new UserInputError('Name is too short');
    if (name.trim().length > 32) throw new UserInputError('Name is too long');

    const application = new ApplicationEntity();
    application.developerId = sessionData.loginState.developerId;
    application.homepage = null;
    application.verified = false;
    application.iconUrl = null;
    application.iconColor = '#444444';
    application.name = name;
    await application.save();

    return Application.fromEntity(application);
  }

  @Query(() => [Application])
  public async applications(
    @Ctx() { sessionData }: WebsiteAPIContext,
  ): Promise<Application[]> {
    if (!sessionData.loginState) throw new UnauthorizedError();
    const applications = await ApplicationEntity.find({
      where: {
        developerId: sessionData.loginState.developerId,
      },
    });
    return applications.map((app) => Application.fromEntity(app));
  }

  @Query(() => Application, {
    nullable: true,
  })
  public async application(
    @Arg('id') id: string,
      @Ctx() { sessionData }: WebsiteAPIContext,
  ): Promise<Application | null> {
    if (!sessionData.loginState) throw new UnauthorizedError();
    const application = await ApplicationEntity.findOne(id);
    if (!application) return null;
    if (!application.developerId.equals(sessionData.loginState.developerId)) throw new UnauthorizedError();
    return Application.fromEntity(application);
  }
}

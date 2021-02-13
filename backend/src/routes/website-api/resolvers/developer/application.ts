/* eslint-disable class-methods-use-this */
import { URL } from 'url';
import { UserInputError } from 'apollo-server-fastify';
import {
  Arg, Ctx, Mutation, Query, Resolver, UnauthorizedError,
} from 'type-graphql';
import ApplicationEntity from '../../../../database/entities/application';
import { ApplicationNotFoundError } from '../../errors';
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

  @Mutation(() => Application)
  public async modifyApplication(
    @Arg('id') id: string,
      @Arg('name') name: string,
      @Arg('homepage', () => String, {
        nullable: true,
      }) homepage: string | null,
      @Ctx() { sessionData }: WebsiteAPIContext,
  ): Promise<Application> {
    if (!sessionData.loginState) throw new UnauthorizedError();
    if (name !== name.trim()) throw new UserInputError('Name should be trimmed');
    if (name.trim().length < 3) throw new UserInputError('Name is too short');
    if (name.trim().length > 32) throw new UserInputError('Name is too long');
    if (homepage) {
      if (homepage.trim() === '') throw new UserInputError('Homepage should not be an empty string. Use null instead');
      let url: URL;
      try {
        url = new URL(homepage.trim());
      } catch {
        throw new UserInputError('Homepage URL is invalid');
      }
      if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new UserInputError('Invalid homepage URL protocol');
    }

    const application = await ApplicationEntity.findOne(id);
    if (!application) throw new ApplicationNotFoundError();
    if (!application.developerId.equals(sessionData.loginState.developerId)) throw new UnauthorizedError();
    if (application.homepage === homepage && application.name === name) return Application.fromEntity(application);
    application.name = name;
    application.homepage = homepage;
    application.verified = false;
    await application.save();
    return Application.fromEntity(application);
  }
}

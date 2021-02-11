/* eslint-disable class-methods-use-this */
import { UserInputError } from 'apollo-server-fastify';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import User from '../../../../database/entities/user';
import { UnknownPromptError } from '../../errors';
import CreateUserResult from '../../models/create-user-result';
import type { WebsiteAPIContext } from '../../types';

@Resolver()
export default class CreateUserResolver {
  @Mutation(() => CreateUserResult)
  public async createUser(
    @Arg('promptId') promptId: string,
      @Arg('email') email: string,
      @Ctx() { sessionData }: WebsiteAPIContext,
  ): Promise<CreateUserResult> {
    if (email !== email.trim()) throw new UserInputError('Email should be trimmed');
    const prompt = sessionData.authPrompts.get(promptId);
    if (!prompt) throw new UnknownPromptError();
    if (!prompt.loginInfo) throw new UserInputError('Login data not provided');
    if (!prompt.loginInfo.symbolInfo) throw new UserInputError('Symbol not provided');

    const existingUser = await User.findOne({
      where: {
        host: prompt.loginInfo.host,
        symbol: prompt.loginInfo.symbolInfo.symbol,
        loginIds: {
          $in: prompt.loginInfo.symbolInfo.loginIds,
        },
      },
    });
    if (existingUser !== undefined) throw new UserInputError('User already exists');
    const user = new User();
    user.host = prompt.loginInfo.host;
    user.symbol = prompt.loginInfo.symbolInfo.symbol;
    user.username = prompt.loginInfo.username;
    user.loginIds = prompt.loginInfo.symbolInfo.loginIds;
    user.email = email;
    await user.save();
    prompt.loginInfo.symbolInfo.userId = user._id;
    return {
      success: true,
    };
  }
}

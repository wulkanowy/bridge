/* eslint-disable class-methods-use-this */
import { Client } from '@wulkanowy/sdk';
import { UserInputError } from 'apollo-server-fastify';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import {
  createKey,
  encryptSymmetrical, encryptWithPublicKey, generatePrivatePublicPair, isObject, verifyCaptchaResponse,
} from '../../../../utils';
import { CaptchaError, InvalidVulcanCredentialsError, UnknownPromptError } from '../../errors';
import LoginResult from '../../models/login-result';
import type { WebsiteAPIContext } from '../../types';

@Resolver()
export default class LoginResolver {
  @Mutation(() => LoginResult)
  public async login(
    @Arg('promptId') promptId: string,
      @Arg('username') username: string,
      @Arg('password') password: string,
      @Arg('host') host: string,
      @Arg('captchaResponse') captchaResponse: string,
      @Ctx() { sessionData, reply }: WebsiteAPIContext,
  ): Promise<LoginResult> {
    if (username !== username.trim()) throw new UserInputError('Username should be trimmed');
    if (host !== host.trim()) throw new UserInputError('Host should be trimmed');
    const prompt = sessionData.authPrompts.get(promptId);
    if (!prompt) throw new UnknownPromptError();
    if (!await verifyCaptchaResponse(captchaResponse)) throw new CaptchaError();
    const client = new Client(host, () => ({
      username,
      password,
    }));
    let symbols: string[];
    try {
      symbols = await client.login();
    } catch (error) {
      if (isObject(error) && error.name === 'InvalidCredentialsError') throw new InvalidVulcanCredentialsError();
      throw error;
    }

    const { privateKey, publicKey } = await generatePrivatePublicPair();
    const tokenKey = createKey();
    const encryptedClient = encryptSymmetrical(JSON.stringify(client.serialize()), tokenKey);
    const encryptedPassword = encryptWithPublicKey(password, publicKey);
    const encryptedPrivateKey = encryptSymmetrical(privateKey, tokenKey);
    const encryptedTokenKey = encryptSymmetrical(tokenKey, prompt.promptSecret);

    prompt.loginInfo = {
      encryptedPassword,
      encryptedPrivateKey,
      encryptedClient,
      publicKey,
      host,
      username,
    };
    // TODO: Find why the promise never resolves
    reply.setCookie(`etk-${promptId}`, encryptedTokenKey, {
      sameSite: 'strict',
      httpOnly: true,
      path: '/',
      maxAge: 3600,
    });
    // In case execution of setCookie takes some time
    // TODO: Remove
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      symbols,
    };
  }
}

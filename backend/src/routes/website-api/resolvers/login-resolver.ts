/* eslint-disable class-methods-use-this */
import { Client } from '@wulkanowy/sdk';
import type { DiaryInfo } from '@wulkanowy/sdk/dist/diary/interfaces/diary/diary-info';
import _ from 'lodash';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import type { SerializedSDK } from '../../../types';
import {
  createKey,
  encryptSymmetrical, encryptWithPublicKey, generatePrivatePublicPair, isObject, verifyCaptchaResponse,
} from '../../../utils';
import { CaptchaError, InvalidVulcanCredentialsError, UnknownPromptError } from '../errors';
import LoginResult from '../models/login-result';
import type LoginResultStudent from '../models/login-result-student';
import type { WebsiteAPIContext } from '../types';

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
    const prompt = sessionData.prompts.get(promptId);
    if (!prompt) throw new UnknownPromptError();
    if (!await verifyCaptchaResponse(captchaResponse)) throw new CaptchaError();
    const client = new Client(host, () => ({
      username,
      password,
    }));
    try {
      await client.login();
    } catch (error) {
      if (isObject(error) && error.name === 'InvalidCredentialsError') throw new InvalidVulcanCredentialsError();
      throw error;
    }
    const diaryList = await client.getDiaryList();
    const diaryStudents = _.groupBy(diaryList.map((e) => e.serialized.info), 'studentId');
    const students = _.toPairs(diaryStudents)
      .map(([, diaryInfoList]: [string, DiaryInfo[]]) => diaryInfoList[0])
      .map<LoginResultStudent>((diaryInfo) => ({
      name: `${diaryInfo.studentFirstName} ${diaryInfo.studentSurname}`,
      studentId: diaryInfo.studentId,
    }));
    const serializedSDK: SerializedSDK = {
      client: client.serialize(),
      diaries: diaryList.map(({ serialized }) => serialized),
    };

    const { privateKey, publicKey } = await generatePrivatePublicPair();
    const tokenKey = createKey();
    const encryptedSDK = encryptSymmetrical(JSON.stringify(serializedSDK), tokenKey);
    const encryptedPassword = encryptWithPublicKey(password, publicKey);
    const encryptedPrivateKey = encryptSymmetrical(privateKey, tokenKey);
    const encryptedTokenKey = encryptSymmetrical(tokenKey, prompt.promptSecret);

    prompt.loginInfo = {
      encryptedPassword,
      encryptedPrivateKey,
      encryptedSDK,
      publicKey,
      host,
      username,
      availableStudentIds: students.map(({ studentId }) => studentId),
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
      students,
    };
  }
}

/* eslint-disable class-methods-use-this */
import { Client } from '@wulkanowy/sdk';
import type { DiaryInfo } from '@wulkanowy/sdk/dist/diary/interfaces/diary/diary-info';
import _ from 'lodash';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import {
  encryptSymmetrical, encryptWithPublicKey, generatePrivatePublicPair, isObject,
} from '../../../utils';
import { InvalidVulcanCredentialsError, UnknownPromptError } from '../errors';
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
      @Ctx() { sessionData, reply }: WebsiteAPIContext,
  ): Promise<LoginResult> {
    const prompt = sessionData.prompts.get(promptId);
    if (!prompt) throw new UnknownPromptError();
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
    const { privateKey, publicKey } = await generatePrivatePublicPair();
    const encryptedPrivateKey = encryptSymmetrical(
      privateKey,
      prompt.promptSecret,
    );
    const encryptedPassword = encryptWithPublicKey(password, publicKey);
    console.log(diaryList.map((e) => e.serialized.info));
    const students = _.toPairs(_.groupBy(diaryList.map((e) => e.serialized.info), 'studentId'))
      .map(([, diaryInfoList]: [string, DiaryInfo[]]) => diaryInfoList[0])
      .map<LoginResultStudent>((diaryInfo) => ({
      name: `${diaryInfo.studentFirstName} ${diaryInfo.studentSurname}`,
      studentId: diaryInfo.studentId,
    }));
    prompt.loginInfo = {
      encryptedPassword,
      host,
      username,
      availableStudentIds: students.map(({ studentId }) => studentId),
    };
    // TODO: Find why the promise never resolves
    reply.setCookie(`epk-${promptId}`, encryptedPrivateKey, {
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

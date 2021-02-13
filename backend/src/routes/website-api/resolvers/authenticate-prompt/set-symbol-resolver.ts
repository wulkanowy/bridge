/* eslint-disable class-methods-use-this */
import { Client } from '@wulkanowy/sdk';
import type { DiaryInfo } from '@wulkanowy/sdk/dist/diary/interfaces/diary/diary-info';
import type { SerializedClient } from '@wulkanowy/sdk/dist/diary/interfaces/serialized-client';
import { UserInputError } from 'apollo-server-fastify';
import _ from 'lodash';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import UserEntity from '../../../../database/entities/user';
import { decryptSymmetrical, decryptWithPrivateKey, encryptSymmetrical } from '../../../../utils';
import { InvalidSymbolError, UnknownPromptError } from '../../errors';
import type LoginStudent from '../../models/login-student';
import SetSymbolResult from '../../models/set-symbol-result';
import type { WebsiteAPIContext } from '../../types';

@Resolver()
export default class SetSymbolResolver {
  @Mutation(() => SetSymbolResult)
  public async setSymbol(
    @Arg('promptId') promptId: string,
      @Arg('symbol') symbol: string,
      @Ctx() { sessionData, request }: WebsiteAPIContext,
  ): Promise<SetSymbolResult> {
    if (symbol !== symbol.trim()) throw new UserInputError('Symbol should be trimmed');
    if (symbol !== symbol.toLowerCase()) throw new UserInputError('Symbol should be lowercase');
    const prompt = sessionData.authPrompts.get(promptId);
    if (!prompt) throw new UnknownPromptError();
    if (!prompt.loginInfo) throw new UserInputError('Login data not provided');
    const { loginInfo } = prompt;

    const encryptedTokenKey: string | undefined = request.cookies[`etk-${promptId}`];
    if (!encryptedTokenKey) throw new UserInputError('Missing etk cookie'); // TODO: Add standard error

    const tokenKey = decryptSymmetrical(encryptedTokenKey, prompt.promptSecret);
    const privateKey = decryptSymmetrical(loginInfo.encryptedPrivateKey, tokenKey);
    const password = decryptWithPrivateKey(loginInfo.encryptedPassword, privateKey);
    const serializedClient = JSON.parse(decryptSymmetrical(loginInfo.encryptedClient, tokenKey)) as SerializedClient;

    const client = Client.deserialize(serializedClient, () => ({
      username: loginInfo.username,
      password,
    }));

    try {
      await client.setSymbol(symbol);
    } catch (error) {
      throw new InvalidSymbolError();
    }

    const diaryList = await client.getDiaryList();
    const diaryStudents = _.groupBy(diaryList.map((e) => e.serialized.info), 'studentId');
    const students = _.values(diaryStudents)
      .map((diaryInfoList: DiaryInfo[]) => diaryInfoList[0])
      .map<LoginStudent>((diaryInfo) => ({
      name: `${diaryInfo.studentFirstName} ${diaryInfo.studentSurname}`,
      studentId: diaryInfo.studentId,
    }));

    const reportingUnits = await client.getReportingUnits();
    const loginIds = reportingUnits.map((unit) => UserEntity.getLoginId(unit.senderId, unit.unitId));

    const encryptedClient = encryptSymmetrical(JSON.stringify(client.serialize()), tokenKey);
    const encryptedDiaries = encryptSymmetrical(JSON.stringify(diaryList.map(({ serialized }) => serialized)), tokenKey);

    const user = await UserEntity.findOne({
      where: {
        host: prompt.loginInfo.host,
        symbol,
        loginIds: {
          $in: loginIds,
        },
      },
    });

    if (user) {
      user.loginIds = loginIds;
      user.username = prompt.loginInfo.username;
      await user.save();
    }

    loginInfo.encryptedClient = encryptedClient;
    loginInfo.symbolInfo = {
      symbol,
      encryptedDiaries,
      loginIds,
      availableStudentIds: students.map(({ studentId }) => studentId),
      userId: user?._id,
    };
    return {
      students,
      registered: user !== undefined,
    };
  }
}

import { Field, ObjectType } from 'type-graphql';
import { StudentsMode } from '../../../types';
import PromptInfoApplication from './prompt-info-application';

@ObjectType()
export default class PromptInfo {
  @Field(() => String)
  public id!: string;

  @Field(() => [String])
  public scopes!: string[];

  @Field(() => String)
  public clientId!: string;

  @Field(() => StudentsMode)
  public studentsMode!: StudentsMode;

  @Field(() => PromptInfoApplication)
  public application!: PromptInfoApplication;
}

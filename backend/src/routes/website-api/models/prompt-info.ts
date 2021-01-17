import { Field, ObjectType } from 'type-graphql';
import PromptInfoApplication from './prompt-info-application';

@ObjectType()
export default class PromptInfo {
  @Field(() => String)
  public id!: string;

  @Field(() => [String])
  public scopes!: string[];

  @Field(() => String)
  public clientId!: string;

  @Field(() => PromptInfoApplication)
  public application!: PromptInfoApplication;
}

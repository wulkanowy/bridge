import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class LoginResult {
  @Field(() => [String])
  public symbols!: string[];
}

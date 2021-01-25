import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class CreateUserResult {
  @Field(() => Boolean)
  public success!: true; // GraphQL doesn't allow empty result
}

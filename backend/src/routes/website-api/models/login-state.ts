import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class LoginState {
  @Field(() => String, {
    nullable: true,
  })
  public name!: string | null;

  @Field(() => String)
  public login!: string;

  @Field(() => String)
  public avatarUrl!: string;
}

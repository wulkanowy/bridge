import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class GitHubUser {
  @Field(() => String)
  public login!: string;

  @Field(() => String, {
    nullable: true,
  })
  public name!: string | null;

  @Field(() => String)
  public url!: string;
}

import { Field, ObjectType } from 'type-graphql';
import GitHubUser from './github-user';

@ObjectType()
export default class PromptInfoApplication {
  @Field(() => String)
  public name!: string;

  @Field(() => String, {
    nullable: true,
  })
  public iconUrl!: string | null;

  @Field(() => String)
  public iconColor!: string;

  @Field(() => Boolean)
  public verified!: boolean;

  @Field(() => GitHubUser)
  public developer!: GitHubUser;

  @Field(() => String, {
    nullable: true,
  })
  public homepage!: string | null;
}

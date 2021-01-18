import { Field, ObjectType } from 'type-graphql';

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
}

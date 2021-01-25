import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export default class LoginStudent {
  @Field(() => Int)
  public studentId!: number;

  @Field(() => String)
  public name!: string;
}

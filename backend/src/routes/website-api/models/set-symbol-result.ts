import { Field, ObjectType } from 'type-graphql';
import LoginStudent from './login-student';

@ObjectType()
export default class SetSymbolResult {
  @Field(() => [LoginStudent])
  public students!: LoginStudent[];

  @Field(() => Boolean)
  public registered!: boolean;
}

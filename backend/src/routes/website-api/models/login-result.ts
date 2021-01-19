import { Field, ObjectType } from 'type-graphql';
import LoginResultStudent from './login-result-student';

@ObjectType()
export default class LoginResult {
  @Field(() => [LoginResultStudent])
  public students!: LoginResultStudent[];
}

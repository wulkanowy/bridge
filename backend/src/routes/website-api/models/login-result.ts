import { Field, ObjectType } from 'type-graphql';
import LoginResultStudent from './login-result-student';

@ObjectType()
export default class LoginResult {
  @Field(() => String)
  public encryptedPrivateKey!: string;

  @Field(() => [LoginResultStudent])
  public students!: LoginResultStudent[];
}

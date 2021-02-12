import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class ApplicationInfo {
  @Field(() => String)
  public id!: string;
}

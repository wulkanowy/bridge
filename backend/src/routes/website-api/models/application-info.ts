import { Field, ObjectType } from 'type-graphql';
import type Application from '../../../database/entities/application';

@ObjectType()
export default class ApplicationInfo {
  @Field(() => String)
  public id!: string;

  @Field(() => String)
  public name!: string;

  @Field(() => String, {
    nullable: true,
  })
  public iconUrl!: string | null;

  @Field(() => String)
  public iconColor!: string;

  public static fromEntity(entity: Application): ApplicationInfo {
    return {
      id: entity._id.toHexString(),
      iconColor: entity.iconColor,
      iconUrl: entity.iconUrl,
      name: entity.name,
    };
  }
}

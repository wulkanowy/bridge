import { Field, ObjectType } from 'type-graphql';
import type ApplicationEntity from '../../../database/entities/application';

@ObjectType()
export default class Application {
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

  @Field(() => String, {
    nullable: true,
  })
  public homepage!: string | null;

  @Field(() => Boolean)
  public verified!: boolean;

  public static fromEntity(entity: ApplicationEntity): Application {
    return {
      id: entity._id.toHexString(),
      iconColor: entity.iconColor,
      iconUrl: entity.iconUrl,
      name: entity.name,
      homepage: entity.homepage,
      verified: entity.verified,
    };
  }
}

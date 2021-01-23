import { nanoid } from 'nanoid';
import type { ObjectID } from 'typeorm';
import {
  BaseEntity,
  Column, Entity, ObjectIdColumn,
} from 'typeorm';

@Entity()
export default class Application extends BaseEntity {
  @ObjectIdColumn()
  public _id!: ObjectID;

  @Column()
  public clientId!: string;

  @Column()
  public clientSecret!: string;

  @Column()
  public name!: string;

  @Column()
  public iconUrl!: string | null;

  @Column()
  public iconColor!: string;

  @Column()
  public verified!: boolean;

  @Column()
  public redirectUris!: string[];

  @Column()
  public ownerGitHubLogin!: string;

  @Column()
  public homepage!: string | null;

  public static generateClientId(): string {
    return nanoid(12);
  }
}

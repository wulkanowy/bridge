import { nanoid } from 'nanoid';
import type { ObjectID } from 'typeorm';
import {
  BaseEntity, Column, Entity, ObjectIdColumn,
} from 'typeorm';

@Entity()
export default class ClientEntity extends BaseEntity {
  @ObjectIdColumn()
  public _id!: ObjectID;

  @Column()
  public clientId!: string;

  @Column()
  public clientSecret!: string;

  @Column()
  public name!: string;

  @Column()
  public redirectUris!: string[];

  @Column()
  public applicationId!: ObjectID;

  public static generateClientId(): string {
    return nanoid(12);
  }

  public static generateClientSecret(): string {
    return nanoid(32);
  }
}

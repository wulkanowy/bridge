import { nanoid } from 'nanoid';
import type { ObjectID } from 'typeorm';
import {
  BaseEntity,
  Column, Entity, ManyToOne, ObjectIdColumn,
} from 'typeorm';
import Developer from './developer';

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

  @ManyToOne(() => Developer)
  public developer!: Developer;

  @Column()
  public homepage!: string | null;

  public static generateClientId(): string {
    return nanoid(12);
  }
}

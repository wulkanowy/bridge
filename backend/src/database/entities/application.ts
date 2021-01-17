import { nanoid } from 'nanoid';
import {
  BaseEntity,
  Column, Entity, ObjectID, ObjectIdColumn,
} from 'typeorm';

@Entity()
export default class Application extends BaseEntity {
  @ObjectIdColumn()
  public _id!: ObjectID;

  @Column()
  public clientId!: string;

  @Column()
  public name!: string;

  @Column()
  public iconUrl!: string | null;

  @Column()
  public verified!: boolean;

  @Column()
  public redirectUris!: string[];

  public static generateClientId(): string {
    return nanoid(12);
  }
}

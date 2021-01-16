import { nanoid } from 'nanoid';
import {
  Column, Entity, ObjectID, ObjectIdColumn,
} from 'typeorm';

@Entity()
export default class Application {
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

  @Column()
  public public!: string[];

  public static generateClientId(): string {
    return nanoid(12);
  }
}

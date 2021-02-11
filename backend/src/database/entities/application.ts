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
  public name!: string;

  @Column()
  public iconUrl!: string | null;

  @Column()
  public iconColor!: string;

  @Column()
  public verified!: boolean;

  @Column()
  public developerId!: ObjectID;

  @Column()
  public homepage!: string | null;
}

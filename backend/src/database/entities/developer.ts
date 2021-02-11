import type { ObjectID } from 'typeorm';
import {
  BaseEntity, Column, Entity, ObjectIdColumn,
} from 'typeorm';

@Entity()
export default class Developer extends BaseEntity {
  @ObjectIdColumn()
  public _id!: ObjectID;

  @Column()
  public gitHubLogin!: string;

  @Column()
  public gitHubId!: string;
}

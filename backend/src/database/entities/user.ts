import type { ObjectID } from 'typeorm';
import {
  BaseEntity, Column, Entity, ObjectIdColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export default class UserEntity extends BaseEntity {
  @ObjectIdColumn()
  public _id!: ObjectID;

  @Column()
  public username!: string;

  @Column()
  public host!: string;

  @Column()
  public symbol!: string;

  @Column()
  public email!: string;

  @Column()
  public loginIds!: string[];

  public static getLoginId(senderId: number, unitId: number): string {
    return `${senderId}@${unitId}`;
  }
}

import { nanoid } from 'nanoid';
import type { ObjectID } from 'typeorm';
import {
  BaseEntity, Column, Entity, ManyToOne, ObjectIdColumn,
} from 'typeorm';
import User from './user';

@Entity()
export default class Token extends BaseEntity {
  @ObjectIdColumn()
  public _id!: ObjectID;

  @Column()
  public tokenId!: string;

  @Column()
  public creationDate!: Date;

  @Column()
  public studentIds!: number[];

  @Column()
  public scopes!: string[];

  @Column()
  public clientId!: string;

  @ManyToOne(() => User)
  public user!: User;

  @Column()
  public tokenSecret!: string;

  @Column()
  public publicKey!: string;

  @Column()
  public encryptedPassword!: string;

  @Column()
  public encryptedSDK!: string;

  @Column()
  public encryptedPrivateKey!: string;

  public static generateTokenId(): string {
    return nanoid(20);
  }
}

import { nanoid } from 'nanoid';
import type { ObjectID } from 'typeorm';
import {
  BaseEntity, Column, Entity, ObjectIdColumn,
} from 'typeorm';

@Entity({
  name: 'tokens',
})
export default class TokenEntity extends BaseEntity {
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

  @Column()
  public userId!: ObjectID;

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

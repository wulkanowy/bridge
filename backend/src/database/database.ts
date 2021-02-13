import type { Connection } from 'typeorm';
import { createConnection } from 'typeorm';
import { requireEnv } from '../utils';
import Application from './entities/application';
import Client from './entities/client';
import Developer from './entities/developer';
import Token from './entities/token';
import User from './entities/user';

class Database {
  private connection!: Connection;

  public async connect(): Promise<void> {
    this.connection = await createConnection({
      type: 'mongodb',
      url: requireEnv('DATABASE_URL'),
      useNewUrlParser: true,
      entities: [
        Application,
        User,
        Token,
        Developer,
        Client,
      ],
      useUnifiedTopology: true,
      logging: false,
    });
  }
}

export default new Database();

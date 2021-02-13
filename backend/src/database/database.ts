import type { Connection } from 'typeorm';
import { createConnection } from 'typeorm';
import { requireEnv } from '../utils';
import ApplicationEntity from './entities/application';
import ClientEntity from './entities/client';
import DeveloperEntity from './entities/developer';
import TokenEntity from './entities/token';
import UserEntity from './entities/user';

class Database {
  private connection!: Connection;

  public async connect(): Promise<void> {
    this.connection = await createConnection({
      type: 'mongodb',
      url: requireEnv('DATABASE_URL'),
      useNewUrlParser: true,
      entities: [
        ApplicationEntity,
        UserEntity,
        TokenEntity,
        DeveloperEntity,
        ClientEntity,
      ],
      useUnifiedTopology: true,
      logging: false,
    });
  }
}

export default new Database();

import type { Connection } from 'typeorm';
import { createConnection } from 'typeorm';
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
      host: 'localhost',
      port: 27017,
      database: 'wulkanowy-bridge-local',
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

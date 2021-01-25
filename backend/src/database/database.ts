import type { Connection, Repository } from 'typeorm';
import { createConnection } from 'typeorm';
import Application from './entities/application';
import Token from './entities/token';
import User from './entities/user';

class Database {
  private connection!: Connection;

  public applicationRepo!: Repository<Application>;

  public userRepo!: Repository<User>;

  public tokenRepo!: Repository<Token>;

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
      ],
      useUnifiedTopology: true,
      logging: false,
    });
    this.applicationRepo = this.connection.getRepository(Application);
    this.userRepo = this.connection.getRepository(User);
    this.tokenRepo = this.connection.getRepository(Token);
  }
}

export default new Database();

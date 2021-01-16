import { Connection, createConnection, Repository } from 'typeorm';
import Application from './entities/application';

class Database {
  private connection!: Connection;

  public applicationRepo!: Repository<Application>;

  public async connect(): Promise<void> {
    this.connection = await createConnection({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'wulkanowy-bridge-local',
      entities: [
        Application,
      ],
      useUnifiedTopology: true,
      logging: false,
    });
    this.applicationRepo = this.connection.getRepository(Application);
  }
}

export default new Database();

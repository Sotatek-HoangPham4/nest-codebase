import { DataSource } from 'typeorm';
import databaseConfig from './database.config';
import { config } from 'dotenv';

config();

const db = databaseConfig();

export default new DataSource({
  type: 'postgres',
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  synchronize: true,
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  entities: ['src/infrastructure/orm/*.ts'],
});

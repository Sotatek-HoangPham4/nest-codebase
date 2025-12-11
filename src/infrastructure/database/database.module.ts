import databaseConfig from '@/config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.get('database');
        console.log('DATABASE CONFIG:', db); // Debug
        if (!db) {
          console.error(config.get('database'));
          throw new Error(
            'Config "database" không tìm thấy. Kiểm tra lại load: [databaseConfig]',
          );
        }

        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          autoLoadEntities: true,
          synchronize: db.synchronize,
          logging: db.logging,
        };
      },
    }),
  ],
})
export class DatabaseModule {}

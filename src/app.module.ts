import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import databaseConfig from './config/database.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from '@/modules/session/session.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { SeedModule } from './seeds/seed.module';
import { NotificationModule } from './modules/notification/notification.module';
import { LocalStorageAdapter } from './modules/storage/infrastructure/adapters/local-storage.adapter';
import { StorageModule } from './modules/storage/storage.module';
import { SearchModule } from './modules/search/search.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { DocumentModule } from './modules/document/document.module';
import { SignatureModule } from './modules/signature/signature.module';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      ignoreEnvFile: false,
    }),

    DatabaseModule,
    RoleModule,
    UserModule,
    AuthModule,
    SessionModule,
    PermissionModule,
    NotificationModule,
    StorageModule,
    SearchModule,
    ScheduleModule,
    DocumentModule,
    SignatureModule,
    OrganizationModule,
  ],
  exports: [DatabaseModule],
})
export class AppModule {}

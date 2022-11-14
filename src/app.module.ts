import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';
import { AreaModule } from './area/area.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import config from "../ormconfig";

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ColumnModule, 
    TaskModule, 
    AreaModule, TeamModule, UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

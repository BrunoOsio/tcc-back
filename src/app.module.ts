import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';
import { AreaModule } from './area/area.module';
import config from "../ormconfig";

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ColumnModule, 
    TaskModule, 
    AreaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

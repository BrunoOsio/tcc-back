import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';
import config from "../ormconfig";

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ColumnModule, 
    TaskModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

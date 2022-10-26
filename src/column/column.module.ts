import { forwardRef, Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnList } from './entities/column.entity';
import { TaskModule } from '../task/task.module';
import { Area } from "../area/entities/area.entity";
import { AreaModule } from '../area/area.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ColumnList]),
    forwardRef(() => TaskModule),
    forwardRef(() => AreaModule)
  ],
  controllers: [ColumnController],
  providers: [ColumnService],
  exports: [ColumnService]
})
export class ColumnModule {}

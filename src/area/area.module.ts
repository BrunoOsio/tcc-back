import { forwardRef, Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { ColumnModule } from '../column/column.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Area]),
    forwardRef(() => ColumnModule),
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService]
})
export class AreaModule {}

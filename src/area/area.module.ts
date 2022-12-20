import { forwardRef, Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { ColumnModule } from '../column/column.module';
import { TeamModule } from '../team/team.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Area]),
    forwardRef(() => ColumnModule),
    forwardRef(() => TeamModule),
    forwardRef(() => UserModule)
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService]
})
export class AreaModule {}

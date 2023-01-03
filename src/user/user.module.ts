import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TeamModule } from "../team/team.module";
import { ColumnModule } from '../column/column.module';
import { AreaModule } from '../area/area.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TeamModule),
    forwardRef(() => ColumnModule),
    forwardRef(() => AreaModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

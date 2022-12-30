import { forwardRef, Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { AreaModule } from '../area/area.module';
import { UserModule } from '../user/user.module';
import { PhotoModule } from '../photo/photo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    forwardRef(() => AreaModule),
    forwardRef(() => UserModule),
    forwardRef(() => PhotoModule),
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService]
})
export class TeamModule {}

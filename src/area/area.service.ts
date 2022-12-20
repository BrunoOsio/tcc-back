import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { TeamService } from '../team/team.service';
import { UpdateLeaderDto } from './dto/update-leader.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AreaService {

  private readonly NO_RELATIONS = { relations: {

  } };

  private readonly RELATIONS = { relations: {
    team: false,
    columns: true,
    leader: true
  } };

  constructor(
    @InjectRepository(Area) 
    private readonly areaRepository: Repository<Area>,

    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createAreaDto: CreateAreaDto, teamId: number): Promise<Area> {
    console.log(createAreaDto);
    const newArea = this.areaRepository.create(createAreaDto);

    const team = await this.teamService.findById(teamId);
    newArea.team = team;

    await this.areaRepository.save(newArea);

    return newArea;
  }

  async findAll(): Promise<Area[]> {
    const areas = await this.areaRepository.find(this.NO_RELATIONS);
    
    return areas;
  }

  async findById(id: number, relations = true): Promise<Area> {
    const areaRelations = relations ? this.RELATIONS : this.NO_RELATIONS;
    const area = await this.areaRepository.findOneOrFail({where: {id}, ...areaRelations});

    return area;
  }

  async findByTeam(teamId: number): Promise<Area[]> {
    const areas: Area[] = [];
    const team = await this.teamService.findById(teamId);

    const areasIds = team.areas.map((area) => area.id);

    for (let id of areasIds) {
      const targetArea = await this.findById(id);
      areas.push(targetArea);
    }

    return areas;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto): Promise<Area> {
    await this.areaRepository.update(id, updateAreaDto);
    
    const updatedArea = await this.findById(id);

    return updatedArea;
  }

  async updateLeader(updateLeaderDto: UpdateLeaderDto): Promise<Area> {
    const {areaId, userId} = updateLeaderDto;

    const area = await this.findById(areaId);

    const user = await this.userService.findById(userId);

    area.leader = user;
    user.areasLeadered = [...user.areasLeadered, area];

    await this.areaRepository.save(area);
    await this.userService.save(user);

    const updated = await this.findById(areaId);

    return updated;
  }

  async remove(id: number): Promise<void> {
    const area = await this.findById(id);

    await this.areaRepository.remove(area);
  }

  async removeAll(): Promise<void> {
    const allAreas = await this.findAll();

    await this.areaRepository.remove(allAreas);
  }
}

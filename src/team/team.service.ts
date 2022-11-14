import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  private readonly NO_RELATIONS = { relations: {} };

  private readonly RELATIONS = {
    relations: {
      areas: true,
      users: true,
    },
  };

  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const newTeam = this.teamRepository.create(createTeamDto);

    await this.teamRepository.save(newTeam);

    return newTeam;
  }

  async findAll(): Promise<Team[]> {
    const teams = await this.teamRepository.find(this.NO_RELATIONS);

    return teams;
  }

  async findById(id: number, relations = true): Promise<Team> {
    const teamRelations = relations ? this.RELATIONS : this.NO_RELATIONS;
    const team = await this.teamRepository.findOneOrFail({
      where: { id },
      ...teamRelations,
    });

    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    await this.teamRepository.update(id, updateTeamDto);

    const updatedTeam = await this.findById(id);

    return updatedTeam;
  }

  async remove(id: number): Promise<void> {
    const team = await this.findById(id);

    await this.teamRepository.remove(team);
  }

  async removeAll(): Promise<void> {
    const allTeams = await this.findAll();

    await this.teamRepository.remove(allTeams);
  }
}

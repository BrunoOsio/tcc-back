import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { ILike, Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { isNumber } from "../shared/helpers/string.helpers";

@Injectable()
export class TeamService {
  private readonly NO_RELATIONS = { relations: {} };

  // private readonly RELATIONS = {
  //   relations: {
  //     areas: true,
  //     members: true,
  //     leaders: true
  //   },
  // };

  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createTeamDto: CreateTeamDto, userId: number): Promise<Team> {
    const newTeam = this.teamRepository.create(createTeamDto);
    const leader = await this.userService.findById(userId);
    newTeam.members = [leader];
    newTeam.leaders = [leader];

    await this.teamRepository.save(newTeam);

    return newTeam;
  }

  async addMember(teamId: number, userId: number): Promise<Team> {
    const team = await this.findById(teamId);
    const newMember = await this.userService.findById(userId);
    team.members.push(newMember);

    await this.teamRepository.save(team);

    return team;
  }

  async findAll(): Promise<Team[]> {
    const teams = await this.teamRepository.find(this.NO_RELATIONS);

    return teams;
  }

  async findTeamsByUser(userId: number): Promise<Team[]> {
    const teams = this.teamRepository.findBy({members: {id: userId}});

    return teams;
  }

  async findByKeyword(key: string): Promise<Team[]> {
    console.log("entrou")
    let teams = [];

    if(isNumber(key)) {
      console.log(isNumber(key))
      const teamNumberMatches = await this.findByNumber(Number(key));
      teams.push(...teamNumberMatches);
    }

    const teamNameMatches = await this.findByIlikeName(key);
    teams.push(...teamNameMatches);

    return teams;
  }

  async findByNumber(number: number, relations = true): Promise<Team[]> {
    // const teamRelations = relations ? this.RELATIONS : this.NO_RELATIONS;

    const teams = this.teamRepository.findBy({
      number,
      // ...teamRelations
    })

    return teams;
  } 

  async findByIlikeName(name: string, relations = true): Promise<Team[]> {
    // const teamRelations = relations ? this.RELATIONS : this.NO_RELATIONS;

    const teams = this.teamRepository.findBy({
      name: ILike(`%${name}%`),
      // ...teamRelations
    })

    return teams;
  } 

  async findById(id: number, relations = true): Promise<Team> {
    // const teamRelations = relations ? this.RELATIONS : this.NO_RELATIONS;
    const team = await this.teamRepository.findOneOrFail({
      where: { id },
      // ...teamRelations,
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

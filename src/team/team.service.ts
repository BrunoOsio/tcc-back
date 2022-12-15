import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { ILike, Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { isNumber } from "../shared/helpers/string.helpers";
import { RequestJoinDto } from './dto/request-join.dto';
import { IsUserOnTeamDto } from './dto/is-user-on-team.dto';

const NOT_FOUND = -1;

@Injectable()
export class TeamService {
  private readonly NO_RELATIONS = { relations: {} };

  private readonly RELATIONS = {
    relations: {
      areas: true,
      members: true,
      leaders: true,
      joinRequests: true
    },
  };

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
    const resultsLimit = 8;
    let teams: Team[] = [];

    if(isNumber(key)) {
      const teamNumberMatches = await this.findByNumber(Number(key));
      teams.push(...teamNumberMatches);
    }

    const teamNameMatches = await this.findByIlikeName(key);
    teams.push(...teamNameMatches);

    const filteredLimit = teams.filter((_, index) => index < resultsLimit);
    
    return filteredLimit;
  }

  async findByNumber(number: number, relations = true): Promise<Team[]> {
    const teamRelations = relations ? this.RELATIONS : this.NO_RELATIONS;

    const teams = await this.teamRepository.find({
      where: {
        number
      },
      ...teamRelations
    })

    return teams;
  } 

  async findByIlikeName(name: string, relations = true): Promise<Team[]> {
    const teamRelations = relations ? this.RELATIONS : this.NO_RELATIONS;

    const teams = await this.teamRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      ...teamRelations
    })

    return teams;
  } 

  async isUserOnTeam(isUserOnTeamDto: IsUserOnTeamDto): Promise<boolean> {
    let isUserOnTeam = false;

    const {userId, teamId} = isUserOnTeamDto;

    const team = await this.findById(teamId);
    
    const isLeader = team.leaders.some(leader => leader.id === userId);
    const isMember = team.members.some(member => member.id === userId);

    if (isLeader || isMember)
      isUserOnTeam = true;

    return isUserOnTeam;
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

  async addJoinRequest(requestJoinDto: RequestJoinDto): Promise<Team> {

    const team = await this.findById(requestJoinDto.teamId);

    const user = await this.userService.findById(requestJoinDto.userId);
    user.joinRequests = [...user.joinRequests, team];

    const joinRequestsRaw = [...team.joinRequests, user];
    
    const newDistinctTeamRequests = [...new Set(joinRequestsRaw.map(user => user))];
    team.joinRequests = [...newDistinctTeamRequests];
    
    await this.teamRepository.save(team);
    this.userService.save(user);

    const updated = await this.findById(requestJoinDto.teamId);

    return updated;
  }

  async removeJoinRequest(requestJoinDto: RequestJoinDto): Promise<Team> {
    const team = await this.findById(requestJoinDto.teamId);
    const newTeamRequests = [...team.joinRequests];
    
    const user = await this.userService.findById(requestJoinDto.userId);
    const newUserRequests = [...user.joinRequests];

    const targetRemoveUserRequestIndex = team.joinRequests.findIndex((userRequest) => userRequest.id === user.id);

    const isUserFound = targetRemoveUserRequestIndex != NOT_FOUND;
    if (isUserFound) {
      newTeamRequests.splice(targetRemoveUserRequestIndex, 1);

      const targetWithdrawTeamToUserRequestsIndex = user.joinRequests.findIndex((teamRequested) => teamRequested.id === team.id);

      const isTeamFound = targetWithdrawTeamToUserRequestsIndex != NOT_FOUND;
      if (isTeamFound) {
        newUserRequests.splice(targetWithdrawTeamToUserRequestsIndex, 1);
      }

    }

    team.joinRequests = [...newTeamRequests];
    user.joinRequests = [...newUserRequests];

    await this.teamRepository.save(team);
    await this.userService.save(user);
    
    const updated = this.findById(requestJoinDto.teamId);

    return updated; 
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

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
import { PhotoService } from '../photo/photo.service';
import { UpdatePhotoDto } from 'src/photo/dto/update-photo.dto';
import { Photo } from 'src/photo/entities/photo.entity';

const NOT_FOUND = -1;

@Injectable()
export class TeamService {
  private readonly NO_RELATIONS = { relations: {} };

  private readonly RELATIONS = {
    relations: {
      areas: true,
      members: true,
      leaders: true,
      joinRequests: true,
      photo: true
    },
  };

  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => PhotoService))
    private readonly photoService: PhotoService,
  ) {}

  async create(createTeamDto: CreateTeamDto, userId: number): Promise<Team> {
    
    const newTeam = this.teamRepository.create(createTeamDto);
    const leader = await this.userService.findById(userId);

    if (createTeamDto.photo) {
      const photo = await this.photoService.create(createTeamDto.photo);
      
      newTeam.photo = photo;
    }

    newTeam.members = [leader];
    newTeam.leaders = [leader];

    await this.teamRepository.save(newTeam);

    const updatedTeam = await this.findById(newTeam.id);
    leader.teams = [...leader.teams, updatedTeam];
    leader.teamsLeadered = [...leader.teamsLeadered, updatedTeam];

    await this.userService.save(leader);

    return newTeam;
  }

  async addMember(teamId: number, userId: number): Promise<Team> {
    const team = await this.findById(teamId);
    const newMember = await this.userService.findById(userId);
    team.members.push(newMember);

    await this.teamRepository.save(team);

    return team;
  }

  async removeMember(teamId: number, userId: number): Promise<Team> {
    const team = await this.findById(teamId);
    const targetRemoveUser = await this.userService.findById(userId);
    
    const newTeamMembers = [...team.members];
    const newUserTeams = [...targetRemoveUser.teams];
    const newTeamLeaders = [...team.leaders];

    const targetRemoveUserIndex = team.members.findIndex((user) => user.id === targetRemoveUser.id);
    const isUserFound = targetRemoveUserIndex != NOT_FOUND;
    if (isUserFound) 
      newTeamMembers.splice(targetRemoveUserIndex, 1);
    
    const targetRemoveTeamOnUserIndex = targetRemoveUser.teams.findIndex((team) => team.id === teamId);
    const isTeamFound = targetRemoveUserIndex != NOT_FOUND;
    if (isTeamFound) 
      newUserTeams.splice(targetRemoveTeamOnUserIndex, 1);

    const targetRemoveLeaderIndex = team.leaders.findIndex((user) => user.id === targetRemoveUser.id);
    const isLeaderFound = targetRemoveUserIndex != NOT_FOUND;
    if (isLeaderFound) 
      newTeamLeaders.splice(targetRemoveLeaderIndex, 1);
    
    team.members = newTeamMembers;
    team.leaders = newTeamLeaders;
    targetRemoveUser.teams = newUserTeams;

    await this.teamRepository.save(team);
    await this.userService.save(targetRemoveUser);

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
    const team = await this.findById(id);
    team.name = updateTeamDto.name;
    team.modality = updateTeamDto.modality;
    team.number = updateTeamDto.number;

    if (updateTeamDto.isChangedPhoto) {
      let photo: Photo | undefined = null;

      if (updateTeamDto.photo)
        photo = await this.photoService.create(updateTeamDto.photo);
        
      team.photo = photo;
    }

    await this.teamRepository.save(team);

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

  async acceptJoinRequest(requestJoinDto: RequestJoinDto): Promise<Team> {
    const team = await this.findById(requestJoinDto.teamId);
    
    const user = await this.userService.findById(requestJoinDto.userId);
    team.members = [...team.members, user];
    
    await this.teamRepository.save(team);
    
    this.removeJoinRequest(requestJoinDto);
    
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

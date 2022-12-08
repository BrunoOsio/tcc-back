import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { RequestJoinDto } from './dto/request-join.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @Query("userId") userId) {
    return this.teamService.create(createTeamDto, userId);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get("searchUser")
  findTeamsByUser(@Query("userId") userId: number) {
    return this.teamService.findTeamsByUser(userId);
  }

  @Get("searchKey")
  findTeamsByKeyword(@Query("key") key: string) {
    return this.teamService.findByKeyword(key);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findById(+id);
  }

  @Put(":teamId/addMember/:userId")
  addMember(@Param("teamId") teamId: number, @Param("userId") userId: number) {
    return this.teamService.addMember(teamId, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Put("/:teamId/addRequest/:userId")
  addJoinRequest(@Param("teamId") teamId: number, @Param("userId") userId: number) {
    return this.teamService.addJoinRequest({teamId, userId});
  }

  @Put("/:teamId/removeRequest/:userId")
  removeJoinRequest(@Param("teamId") teamId: number, @Param("userId") userId: number) {
    return this.teamService.removeJoinRequest({teamId, userId});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }

  @Delete('dev/removeAll')
  removeAll() {
    return this.teamService.removeAll();
  }
}

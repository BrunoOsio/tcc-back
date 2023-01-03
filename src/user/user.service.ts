import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { compareValues, hash } from '../shared/helpers/bcrypt.helpers';
import { UserLoginDto } from './dto/user-login.dto';
import { Team } from '../team/entities/team.entity';
import { ColumnService } from '../column/column.service';
import { TeamService } from '../team/team.service';
import { AreaService } from '../area/area.service';
import { ColumnList } from '../column/entities/column.entity';
import { AreasInformationsDTO } from 'src/area/dto/areas-informations.dto';

@Injectable()
export class UserService {

  private readonly NO_RELATIONS = { relations: {

  } };

  private readonly RELATIONS = { relations: {
    teams: true,
    teamsLeadered: true,
    areasLeadered: true,
    joinRequests: true
  } };

  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => ColumnService))
    private readonly columnService: ColumnService,

    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,

    @Inject(forwardRef(() => AreaService))
    private readonly areaService: AreaService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    newUser.password = await hash(newUser.password);

    await this.userRepository.save(newUser);

    return newUser;
  }

  async checkLogin(userLoginDto: UserLoginDto): Promise<User> {
    let userLogin: User = null;

    const user = await this.findByEmail(userLoginDto.email);

    if (user) {
      const { password: hashedPassword } = user;
      
      const isPasswordEquals = await compareValues(userLoginDto.password, hashedPassword);
      if (isPasswordEquals)
        userLogin = user;
    }
    
    return userLogin;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find(this.NO_RELATIONS);

    return users;  
  }

  async findById(id: number, relations=true): Promise<User> {
    const userRelations = relations ? this.RELATIONS : this.NO_RELATIONS;
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      ...userRelations,
    });

    return user;  
  }

  async findByEmail(email: string, relations=true): Promise<User> {
    const userRelations = relations ? this.RELATIONS : this.NO_RELATIONS;
    const user = await this.userRepository.findOne({
      where: { email },
      ...userRelations,
    });

    return user;  
  }

  async findLeaderedTeams(userId: number): Promise<Team[]> {
    const user = await this.findById(userId);
    
    return user.teamsLeadered;
  }

  async countLeaderedAreaTasks(userId: number, teamId: number): Promise<AreasInformationsDTO> {
    const user = await this.findById(userId);

    const areas = await this.areaService.findByTeam(teamId);

    const leaderedAreas = areas.filter(area => area.leader?.id === user.id);
    let leaderedColumns: ColumnList[] = [];

    for (let area of leaderedAreas) {
      const columns = await this.columnService.findByArea(area.id);
      const undoneColumns = columns.filter((column) => !column.isForDoneTasks);
      
      leaderedColumns = [...leaderedColumns, ...undoneColumns];
    }
    
    const tasksIdsOrder = leaderedColumns.map((column) => column.taskIdsOrder);

    let undoneTasksList: string[] = [];

    tasksIdsOrder.forEach((order) => {
      
      const split = order?.split(" ");
      if (split)
        undoneTasksList.push(...split);
    })

    return {
      areasLeaderedLength: leaderedAreas.length, 
      undoneTasksLength: undoneTasksList.length
    };
  }

  async save(user: User): Promise<User> {
    await this.userRepository.save(user);
    const updated = await this.findById(user.id);

    return updated;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);

    const updatedUser = await this.findById(id);

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);

    await this.userRepository.remove(user);
  }

  async removeAll(): Promise<void> {
    const allUsers = await this.findAll();

    await this.userRepository.remove(allUsers);
  }
}
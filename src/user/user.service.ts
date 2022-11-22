import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamService } from '../team/team.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { compareValues, hash } from '../shared/helpers/bcrypt.helpers';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class UserService {

  private readonly NO_RELATIONS = { relations: {

  } };

  private readonly RELATIONS = { relations: {
    teams: true,
    teamsLeadered: true
  } };

  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,
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

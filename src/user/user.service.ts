import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamService } from '../team/team.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  private readonly NO_RELATIONS = { relations: {

  } };

  private readonly RELATIONS = { relations: {
    teams: true
  } };

  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,
  ) {}

  //!URGENT!: CRIPTOGRAFAR SENHA
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);

    return newUser;
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

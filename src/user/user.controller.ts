import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("checkLogin")
  checkLogin(@Body() userLoginDto: UserLoginDto) {
    return this.userService.checkLogin(userLoginDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get("search")
  findByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('dev/removeAll')
  removeAll(@Param('id') id: string) {
    return this.userService.removeAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

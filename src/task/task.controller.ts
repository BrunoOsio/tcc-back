import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Query("columnId") columnId: number
  ) {
    return this.taskService.create(createTaskDto, columnId);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('raw')
  findAllRaw() {
    return this.taskService.findAllRaw();
  }

  @Get('biggestId')
  findBiggestId() {
    return this.taskService.findBiggestId();
  }

  @Get('find')
  findByColumnId(@Query('columnId') columnId: string) {
    return this.taskService.findByColumnId(+columnId);
  }

  @Get('/:id/isExist')
  isTaskExist(@Param('id') id: string) {
    return this.taskService.isTaskExist(+id);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.taskService.findById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Query("columnId") columnId: number
  ) {
    return this.taskService.update(+id, updateTaskDto, columnId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}

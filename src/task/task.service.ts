import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnService } from '../column/column.service';
import { IsNull, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { destructTaskIdsToArray, formatTaskIdsOrderToString, formatTaskIdsOrderWhenTaskCreated } from '../column/helpers/TaskIds.helpers';
import { Max } from 'class-validator';

@Injectable()
export class TaskService {

  private readonly RELATIONS = {
    relations: {
      column: true,
    },
  };

  private readonly NO_RELATIONS = { relations: {} };

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @Inject(forwardRef(() => ColumnService))
    private readonly columnService: ColumnService,
  ) {}

  async create(createTaskDto: CreateTaskDto, columnId: number): Promise<Task> {
    const newTask = await this.taskRepository.create(createTaskDto);

    const column = await this.columnService.findById(columnId);
    newTask.column = column;

    await this.taskRepository.save(newTask);

    column.taskIdsOrder = formatTaskIdsOrderWhenTaskCreated(column.taskIdsOrder, newTask.id);

    await this.columnService.update(columnId, column);

    return newTask;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.taskRepository.find(this.RELATIONS);

    return tasks;
  }

  async findAllRaw(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();

    return tasks;
  }

  async findBiggestId(): Promise<number> {
    let biggestId = 1;
    const tasks = await this.findAll();
    
    tasks.forEach(task => {
      if(task.id > biggestId) biggestId = task.id;
    });

    return biggestId;
  }

  async findById(id: number, relations = false): Promise<Task> {
    const taskRelations = relations ? this.RELATIONS : this.NO_RELATIONS;

    const task = await this.taskRepository.findOneOrFail({
      where: { id },
      ...taskRelations,
    });

    return task;
  }

  async findByColumnId(columnId: number) {
    const tasks = await this.taskRepository.findBy({
      column: { id: columnId },
    });

    return tasks;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    columnId?: number,
  ): Promise<Task> {
    await this.taskRepository.update(id, updateTaskDto);

    const updatedTask = await this.findById(id);

    if (columnId) {
      const column = await this.columnService.findById(columnId);

      updatedTask.column = column;
      await this.taskRepository.update(id, updatedTask);
    }

    return updatedTask;
  }

  async remove(taskId: number): Promise<void> {
    const task = await this.findById(taskId, true);
    await this.taskRepository.remove(task);

    const column = task.column;

    const taskIds = destructTaskIdsToArray(column.taskIdsOrder);
    taskIds.splice(taskIds.indexOf(taskId), 1);

    const formattedTaskIds = formatTaskIdsOrderToString(taskIds);

    column.taskIdsOrder = formattedTaskIds;

    await this.columnService.update(column.id, column);
  }

  async removeAll(): Promise<void> {
    const allTasks = await this.findAll();

    this.taskRepository.remove(allTasks);
  }
}

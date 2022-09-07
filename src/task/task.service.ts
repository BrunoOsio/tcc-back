import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnService } from '../column/column.service';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { formatTaskIdsOrderWhenTaskCreated } from '../column/helpers/formatTaskIdsOrder.helpers';

@Injectable()
export class TaskService {

  private readonly TASK_RELATIONS = {
    relations: {
      column: true,
    },
  };

  private readonly TASK_RELATIONS_NO_COLUMNS = { relations: {} };

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

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
    const tasks = await this.taskRepository.find(this.TASK_RELATIONS);

    return tasks;
  }

  async findAllRaw(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();

    return tasks;
  }

  async findById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneOrFail({
      where: { id },
      ...this.TASK_RELATIONS,
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
    }

    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findById(id);

    await this.taskRepository.remove(task);
  }

  async removeAll(): Promise<void> {
    const allTasks = await this.findAll();

    this.taskRepository.remove(allTasks);
  }
}

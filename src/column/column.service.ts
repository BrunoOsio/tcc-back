import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskService } from '../task/task.service';
import { Repository } from 'typeorm';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ColumnList } from './entities/column.entity';
import { ColumnsOrderResult } from './types/ColumnsOrderResult';
import { AreaService } from '../area/area.service';

@Injectable()
export class ColumnService {

  private readonly NO_RELATIONS = { relations: {

  } };

  private readonly RELATIONS = { relations: {
  } };

  constructor(
    @InjectRepository(ColumnList) 
    private readonly columnRepository: Repository<ColumnList>,

    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,

    @Inject(forwardRef(() => AreaService))
    private readonly areaService: AreaService,
  ) {}

  async testServer() {
    return {data: "hello world"}
  }

  async create(createColumnDto: CreateColumnDto, areaId: number): Promise<ColumnList> {
    const newColumn = this.columnRepository.create(createColumnDto);

    const area = await this.areaService.findById(areaId);
    newColumn.area = area;

    await this.columnRepository.save(newColumn);

    return newColumn
  }

  async findAll(): Promise<ColumnList[]> {
    const columns = await this.columnRepository.find(this.NO_RELATIONS);
    
    return columns;
  }

  async findById(id: number, relations = false): Promise<ColumnList> {
    const columnRelations = relations ? this.RELATIONS : this.NO_RELATIONS;
    const column = await this.columnRepository.findOneOrFail({where: {id}, ...columnRelations});

    return column;
  }

  async findByArea(areaId: number): Promise<ColumnList[]> {
    const area = await this.areaService.findById(areaId);

    return area.columns;
  }

  async findBiggestId(): Promise<number> {
    let biggestId = 0;
    const columns = await this.findAll();
    
    columns.forEach(task => {
      if(task.id > biggestId) biggestId = task.id;
    });

    return biggestId;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto): Promise<ColumnList> {
    await this.columnRepository.update(id, updateColumnDto);
    
    const updatedColumn = await this.findById(id);

    return updatedColumn;
  }

  async reorder(columnsOrderResult: ColumnsOrderResult): Promise<object[]> {
    const {taskId, sourceColumn: source, destinationColumn: destination} = columnsOrderResult;

    const sourceColumn = await this.findById(source.id);
    sourceColumn.taskIdsOrder = source.taskIdsOrder;

    const destinationColumn = await this.findById(destination.id);
    destinationColumn.taskIdsOrder = destination.taskIdsOrder;
    
    await this.update(sourceColumn.id, sourceColumn);
    await this.update(destinationColumn.id, destinationColumn);

    const task = await this.taskService.findById(taskId);
    await this.taskService.update(task.id, task, destinationColumn.id);
    
    const newSourceColumn = await this.findById(source.id);
    const newDestinationColumn = await this.findById(destination.id);
    const newTask = await this.taskService.findById(task.id);

    return [newSourceColumn, newDestinationColumn, newTask];
  }

  async remove(id: number): Promise<void> {
    const column = await this.findById(id);

    await this.columnRepository.remove(column);
  }

  async removeAll(): Promise<void> {
    const allColumns = await this.findAll();

    await this.columnRepository.remove(allColumns);
  }
}

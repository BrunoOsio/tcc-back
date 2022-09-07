import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ColumnList } from './entities/column.entity';
import { ColumnsOrderResult } from './types/ColumnsOrderResult';

@Injectable()
export class ColumnService {

  private readonly COLUMN_RELATIONS = { relations: {

  } };

  constructor(
    @InjectRepository(ColumnList) 
    private readonly columnRepository: Repository<ColumnList>,
  ) {}

  async create(createColumnDto: CreateColumnDto): Promise<ColumnList> {
    const newColumn = this.columnRepository.create(createColumnDto);

    await this.columnRepository.save(newColumn);

    return newColumn
  }

  async findAll(): Promise<ColumnList[]> {
    const columns = await this.columnRepository.find(this.COLUMN_RELATIONS);
    
    return columns;
  }

  async findById(id: number): Promise<ColumnList> {
    const column = await this.columnRepository.findOneOrFail({where: {id}, ...this.COLUMN_RELATIONS});

    return column;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto): Promise<ColumnList> {
    await this.columnRepository.update(id, updateColumnDto);
    
    const updatedColumn = await this.findById(id);

    return updatedColumn;
  }

  async reorder(columnsOrderResult: ColumnsOrderResult): Promise<ColumnList[]> {
    const {sourceColumn: source, destinationColumn: destination} = columnsOrderResult;

    const sourceColumn = await this.findById(source.id);
    sourceColumn.taskIdsOrder = source.taskIdsOrder;

    const destinationColumn = await this.findById(destination.id);
    destinationColumn.taskIdsOrder = destination.taskIdsOrder;
    
    await this.update(sourceColumn.id, sourceColumn);
    await this.update(destinationColumn.id, destinationColumn);

    const newSourceColumn = await this.findById(source.id);
    const newDestinationColumn = await this.findById(destination.id);

    return [newSourceColumn, newDestinationColumn];
  }

  async remove(id: number) {
    const column = await this.findById(id);

    await this.columnRepository.remove(column);
  }

  async removeAll() {
    const allColumns = await this.findAll();

    await this.columnRepository.remove(allColumns);
  }
}

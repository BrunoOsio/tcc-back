import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ColumnList } from './entities/column.entity';

@Injectable()
export class ColumnService {

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
    const columns = await this.columnRepository.find();
    
    return columns;
  }

  async findById(id: number): Promise<ColumnList> {
    const column = await this.columnRepository.findOneByOrFail({id});

    return column;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto) {
    await this.columnRepository.update(id, updateColumnDto);

    const updatedColumn = await this.findById(id);

    return updatedColumn;
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

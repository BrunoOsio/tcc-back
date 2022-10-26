import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnService } from '../column/column.service';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';

@Injectable()
export class AreaService {

  private readonly NO_RELATIONS = { relations: {

  } };

  private readonly RELATIONS = { relations: {
    columns: true
  } };

  constructor(
    @InjectRepository(Area) 
    private readonly areaRepository: Repository<Area>,

    @Inject(forwardRef(() => ColumnService))
    private readonly columnService: ColumnService,
  ) {}

  async create(createAreaDto: CreateAreaDto): Promise<Area> {

    const newArea = this.areaRepository.create(createAreaDto);

    await this.areaRepository.save(newArea);

    return newArea;
  }

  async findAll(): Promise<Area[]> {
    const areas = await this.areaRepository.find(this.NO_RELATIONS);
    
    return areas;
  }

  async findById(id: number, relations = true): Promise<Area> {
    const areaRelations = relations ? this.RELATIONS : this.NO_RELATIONS;
    const area = await this.areaRepository.findOneOrFail({where: {id}, ...areaRelations});

    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto): Promise<Area> {
    await this.areaRepository.update(id, updateAreaDto);
    
    const updatedArea = await this.findById(id);

    return updatedArea;
  }

  async remove(id: number): Promise<void> {
    const area = await this.findById(id);

    await this.areaRepository.remove(area);
  }

  async removeAll(): Promise<void> {
    const allAreas = await this.findAll();

    await this.areaRepository.remove(allAreas);
  }
}

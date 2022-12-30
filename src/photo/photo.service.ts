import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamService } from "../team/team.service";
import { Repository } from 'typeorm';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';

@Injectable()
export class PhotoService {
  private readonly NO_RELATIONS = { relations: {} };

  private readonly RELATIONS = {
    relations: {

    },
  };

  constructor(
    @InjectRepository(Photo) 
    private readonly photoRepository: Repository<Photo>,

    @Inject(forwardRef(() => TeamService))
    private readonly photoService: PhotoService,
  ) {}

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const newPhoto = this.photoRepository.create(createPhotoDto);

    await this.photoRepository.save(newPhoto);

    return newPhoto;
  }

  async save(photo: Photo): Promise<Photo> {
    await this.photoRepository.save(photo);

    const updated = this.findById(photo.id);

    return updated;
  }

  findAll() {
    return `This action returns all photo`;
  }

  async findById(id: number): Promise<Photo> {
    const photo = await this.photoRepository.findOneByOrFail({id});

    return photo;
  }

  update(id: number, updatePhotoDto: UpdatePhotoDto) {
    return `This action updates a #${id} photo`;
  }

  remove(id: number) {
    return `This action removes a #${id} photo`;
  }
}

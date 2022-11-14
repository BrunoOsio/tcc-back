import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  create(
    @Body() createAreaDto: CreateAreaDto,
    @Query("teamId") teamId: number
    ) {
    return this.areaService.create(createAreaDto, teamId);
  }

  @Get()
  findAll() {
    return this.areaService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.areaService.findById(+id);
  }

  @Get('ofTeam/:teamId')
  findByTeam(@Param('teamId') id: string) {
    return this.areaService.findByTeam(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areaService.update(+id, updateAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areaService.remove(+id);
  }

  @Delete('/dev/removeAll')
  removeAll(): Promise<void> {
    return this.areaService.removeAll();
  }
}

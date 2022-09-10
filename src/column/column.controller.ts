import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Query } from 'typeorm/driver/Query';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Get('ola/testServer')
  testServer() {
    return this.columnService.testServer();
  }

  @Post()
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnService.create(createColumnDto);
  }

  @Get()
  findAll() {
    return this.columnService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.columnService.findById(+id);
  }

  @Patch('reorder')
  reorder(@Body() reorderColumnsDto: ReorderColumnsDto) {
    return this.columnService.reorder(reorderColumnsDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnService.update(+id, updateColumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnService.remove(+id);
  }

  @Delete('/dev/removeAll')
  removeAll(): Promise<void> {
    return this.columnService.removeAll();
  }
}

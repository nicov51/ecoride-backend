import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { CreateParticipationDto } from '../../dto/create-participation.dto';

@Controller('participations')
export class ParticipationsController {
  constructor(private readonly participationsService: ParticipationsService) {}
  @Post()
  create(@Body() createParticipationDto: CreateParticipationDto) {
    return this.participationsService.create(createParticipationDto);
  }
  @Get()
  findAll() {
    return this.participationsService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.participationsService.remove(+id);
  }
}

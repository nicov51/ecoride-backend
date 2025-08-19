import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { CreateParticipationDto } from '../../dto/create-participation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../../dto/request-with-user.dto';

@Controller('participations')
export class ParticipationsController {
  constructor(private readonly participationsService: ParticipationsService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateParticipationDto, @Req() req: RequestWithUser) {
    return this.participationsService.create({
      rideId: dto.rideId,
      userId: req.user.id,
    });
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

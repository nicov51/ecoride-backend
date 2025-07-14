import { Module } from '@nestjs/common';
import { ParticipationsController } from './participations.controller';
import { ParticipationsService } from './participations.service';

@Module({
  controllers: [ParticipationsController],
  providers: [ParticipationsService]
})
export class ParticipationsModule {}

import { Module } from '@nestjs/common';
import { ItineraryController } from './itinerary.controller';
import { HttpModule } from '@nestjs/axios';
import { ItineraryService } from './itinerary.service';

@Module({
  imports: [HttpModule],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule {}

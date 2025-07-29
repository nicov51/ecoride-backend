import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ItineraryRequest,
  ItineraryService,
  ORSResponse,
} from './itinerary.service';

@Controller('itinerary')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  /**
   * Endpoint POST /itinerary
   */
  @Post()
  async getItinerary(@Body() body: ItineraryRequest): Promise<ORSResponse> {
    if (!body.start || !body.end) {
      throw new BadRequestException('Coordonnées départ/arrivée requises.');
    }

    return this.itineraryService.getItinerary(body);
  }
}

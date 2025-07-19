// src/geocoding/geocoding.controller.ts

import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { GeocodingService, NominatimResult } from './geocoding.service';

@Controller('geocoding')
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}
  @Get()
  async geocode(@Query('q') query: string): Promise<NominatimResult[]> {
    if (!query || query.trim().length < 3) {
      throw new BadRequestException(
        'paramètre requis avec au moins 3 caractères.',
      );
    }

    return this.geocodingService.geocode(query);
  }
}

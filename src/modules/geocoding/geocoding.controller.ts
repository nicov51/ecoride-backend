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
    // Nettoyage de la requête
    const cleanedQuery = query.trim();

    try {
      // Appel au service avec la requête nettoyée
      const results = await this.geocodingService.geocode(cleanedQuery);

      // On s'assure qu'on retourne toujours un tableau (même vide)
      return results || [];
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  }
}

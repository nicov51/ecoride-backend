import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}
@Injectable()
export class GeocodingService {
  constructor(private readonly http: HttpService) {}
  //appel a Nominatim pour geocoder une adresse
  async geocode(query: string): Promise<NominatimResult[]> {
    const url = 'https://nominatim.openstreetmap.org/search';
    const params = {
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '5',
    };
    const headers = {
      'User-Agent': 'my-carpool-app/1.0',
    };
    const response = await lastValueFrom(
      this.http.get<NominatimResult[]>(url, { params, headers }),
    );
    return response.data;
  }
}

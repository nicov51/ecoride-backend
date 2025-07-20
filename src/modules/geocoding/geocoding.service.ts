import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  // Cache simple en mémoire avec Map = struture de données clé-valeur
  private cache = new Map<string, NominatimResult[]>();
  // fraicheur des données avec Time To Live
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 heure
  constructor(private readonly http: HttpService) {}
  //appel a Nominatim pour geocoder une adresse
  async geocode(query: string): Promise<NominatimResult[] | undefined> {
    // Normalisation de la requete
    const normalizedQuery = query.trim().toLowerCase();
    //Verification du cache   has() si present on recupere avec get()
    if (this.cache.has(normalizedQuery)) {
      return this.cache.get(normalizedQuery)!;
    }
    const url = 'https://nominatim.openstreetmap.org/search';
    const params = {
      q: normalizedQuery,
      format: 'json',
      addressdetails: '1',
      limit: '5',
      countrycodes: 'fr', // Filtre par pays
    };
    const headers = {
      'User-Agent': 'my-carpool-app/1.0',
    };
    try {
      const response = await lastValueFrom(
        this.http.get<NominatimResult[]>(url, { params, headers }).pipe(
          catchError((error) => {
            console.error('Geocoding error:', error);
            return of([] as NominatimResult[]); //en cas d'erreur on retourne un tableau vide
          }),
        ),
      );
      // Maintenant response est soit AxiosResponse<NominatimResult[]> soit NominatimResult[]
      const results = Array.isArray(response) ? response : response.data;
      // Mise en cache
      this.cache.set(normalizedQuery, results);
      setTimeout(() => this.cache.delete(normalizedQuery), this.CACHE_TTL);

      return results;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return [];
    }
  }
}

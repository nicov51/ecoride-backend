import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

export interface ItineraryRequest {
  start: [number, number]; // [lon, lat]
  end: [number, number]; // [lon, lat]
}

export interface ORSGeometry {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface ORSFeature {
  type: 'Feature';
  geometry: ORSGeometry;
  properties: Record<string, unknown>;
}

export interface ORSResponse {
  type: 'FeatureCollection';
  features: ORSFeature[];
}

@Injectable()
export class ItineraryService {
  constructor(private readonly http: HttpService) {}

  /**
   * Appelle l’API OpenRouteService pour obtenir un itinéraire entre deux coordonnées
   * @param body Coordonnées de départ et d’arrivée
   * @returns Données GeoJSON de l'itinéraire
   */
  async getItinerary(body: ItineraryRequest): Promise<ORSResponse> {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

    const headers = {
      Authorization: process.env.OPENROUTESERVICE_API_KEY,
      'Content-Type': 'application/json',
    };

    const payload = {
      coordinates: [body.start, body.end],
      instructions: false,
    };
    console.log('Payload ORS :', JSON.stringify(payload));

    const response = await lastValueFrom(
      this.http.post<ORSResponse>(url, payload, { headers }),
    );
    console.log('Réponse ORS :', JSON.stringify(response.data, null, 2));
    return response.data;
  }
}

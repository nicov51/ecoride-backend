export type RgpdRequestType =
  | 'access'
  | 'rectification'
  | 'erasure'
  | 'portability'
  | 'opposition';

export interface RgpdRequestData {
  email: string;
  requestType: RgpdRequestType;
  description?: string;
}

export interface RgpdResponse {
  success: boolean;
  message: string;
}

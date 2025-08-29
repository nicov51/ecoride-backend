export interface RideCancellationEmailData {
  rideTitle: string;
  driverName: string;
  participants: { email: string; name: string }[];
  departureDate: string;
  reason?: string;
}

export interface RideCompletedEmailData {
  rideTitle: string;
  driverName: string;
  participants: { email: string; name: string }[];
  rideId: number;
}

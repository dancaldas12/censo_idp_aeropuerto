export type PersonType = 'Miembro' | 'Creyente';

export interface CensusFormData {
  nombreCompleto: string;
  dni: string;
  edad: number | string;
  telefono: string;
  correo: string;
  tipoPersona: PersonType;
  direccion: string;
  referencia?: string;
  distrito: string;
  provincia: string;
  departamento: string;
  latitud: number | string;
  longitud: number | string;
  consentimiento: boolean;
}

export interface GoogleSheetsRow {
  uuid: string;
  fechaRegistro: string;
  nombreCompleto: string;
  dni: string;
  edad: string;
  telefono: string;
  correo: string;
  tipoPersona: string;
  direccion: string;
  referencia: string;
  distrito: string;
  provincia: string;
  departamento: string;
  latitud: string;
  longitud: string;
  googleMapsUrl: string;
  consentimiento: string;
}

export interface ReverseGeocodeResponse {
  address: string;
  distrito: string;
  provincia: string;
  departamento: string;
  latitud: number;
  longitud: number;
  displayName: string;
}

export interface SearchGeocodeResponse {
  displayName: string;
  address: string;
  distrito: string;
  provincia: string;
  departamento: string;
  lat: number;
  lon: number;
}

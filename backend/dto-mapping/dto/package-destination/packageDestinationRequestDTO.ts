export interface ILocationDTO {
  latitude: number;
  longitude: number;
}
export interface ICreateDestinationRequestDTO {
  name: string;
  location: ILocationDTO;
  images?: string[];
}
export interface IUpdateDestinationRequestDTO {
  name?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
}

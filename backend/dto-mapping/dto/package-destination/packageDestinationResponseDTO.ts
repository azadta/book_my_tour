import { ILocationDTO } from "./packageDestinationRequestDTO";


export interface IDestinationResponseDTO {
  _id: string;
  name: string;
  location: ILocationDTO;
  images: string[];
  createdAt: string | Date;
}

export interface IDestinationSummaryDTO {
  _id: string;
  name: string;
}

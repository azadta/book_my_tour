import {
  ICategorySummaryDTO,
  IDestinationSummaryDTO,
  IItineraryDayDTO,
  IOperatorSummaryDTO,
} from "./packageRequestDTO";

export interface IPackageResponseDTO {
  _id: string;
  name: string;
  amount: number;
  destinations: IDestinationSummaryDTO[]|string []
  duration: {
    day: number;
    night: number;
  };
  specifications?: string;
  startDate: Date;
  remark?: string;
  discount?: number;
  availableSlots?: string;
  images: string[];
  category: ICategorySummaryDTO|string
  operatorId: IOperatorSummaryDTO|string
  itinerary: IItineraryDayDTO[];
  reviewCount?: number;
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

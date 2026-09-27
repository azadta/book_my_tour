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
    childPricing: {
    enabled: boolean;
    minAge?: number|undefined;
    maxAge?: number|undefined;
    percentage?: number|undefined;
  };
  destinations: IDestinationSummaryDTO[] | string[];
  duration: {
    day: number;
    night: number;
  };
  specifications?: string;
  startDate: Date;
  startPoint: string;
  remark?: string;
  discount?: number;
  availableSlots?: string;
  images: string[];
  category: ICategorySummaryDTO | string;
  operatorId: IOperatorSummaryDTO | string;
  itinerary: IItineraryDayDTO[];
  reviewCount?: number;
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

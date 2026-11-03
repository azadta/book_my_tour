import { Types } from "mongoose";
import { Ipackage } from "../../../models/Package";
import {
  ICategorySummaryDTO,
  ICategorySummaryInput,
  IDestinationSummaryDTO,
  IDestinationSummaryInput,
  IItineraryDayDTO,
  IOperatorSummaryDTO,
  IOperatorSummaryInput,
} from "./packageRequestDTO";

export interface IPackageResponseDTO {
  _id: string;
  name: string;
  amount: number;
  childPricing: {
    enabled: boolean;
    minAge?: number | undefined;
    maxAge?: number | undefined;
    percentage?: number | undefined;
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

export type PackageWithDestinations = Omit<Ipackage, "destinations"> & {
  destinations: IDestinationSummaryInput[]|Types.ObjectId[];
};

export type PackageResponseInput = Omit<
  Ipackage,
  "destinations" | "category" | "operatorId"
> & {
  destinations: IDestinationSummaryInput[] | Types.ObjectId[];
  category: ICategorySummaryInput | Types.ObjectId;
  operatorId: IOperatorSummaryInput | Types.ObjectId;
  reviewCount?: number;
  averageRating?: number;
};

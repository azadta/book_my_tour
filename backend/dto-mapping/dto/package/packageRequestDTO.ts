import { Types } from "mongoose";

export interface IActivityDTO {
  id: string;
  name: string;
  image: string;
  description: string;
  timing: {
    from: string;
    to: string;
  };
  cost: number;
  customizable: boolean;
}

export interface IOptionalActivityDTO {
  id: string;
  name: string;
  image: string;
  description: string;
  timing: {
    from: string;
    to: string;
  };
  cost: number;
}

export interface IItineraryDayDTO {
  day: number;
  gallery: string[];
  activities: IActivityDTO[];
  optionalActivities: IOptionalActivityDTO[];
}

export interface IDestinationSummaryDTO {
  _id: string;
  name: string;
}

export interface ICategorySummaryDTO {
  _id: string;
  name: string;
}

export interface IOperatorSummaryDTO {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface ICreatePackageRequestDTO {
  name: string;
  amount: number;
  operatorId: Types.ObjectId;
  destinations: Types.ObjectId[];
  duration: {
    day: number;
    night: number;
  };
    childPricing: {
    enabled: boolean;
    minAge?: number|undefined;
    maxAge?: number|undefined;
    percentage?: number|undefined;
  };
  specifications?: string;
  startDate: Date;
  startPoint:string,
  remark?: string;
  discount?: number;
  availableSlots?: string;
  images: string[];
  category: Types.ObjectId;
  itinerary: IItineraryDayDTO[];
}

export type IUpdatePackageRequestDTO = Omit<
  ICreatePackageRequestDTO,
  "operatorId"
>;

export interface IPackageFilterQueryDTO {
  page?: number | string;
  limit?: number | string;
  category?: string;
  destination?: string;
  startDate?: string;
  maxBudget?: number | string;
  search?: string;
  maxDuration?: number | string;
  sortBy?: "createdAt" | "price" | "rating";
  sortOrder?: "asc" | "desc";
}

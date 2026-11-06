import type { IActivityDTO, IItineraryDayDTO, IOptionalActivityDTO, PackageInput } from "../../../backend/dto-mapping/dto/package/packageRequestDTO";
import type { BaseFormData, ICategory } from "./interfaces";

export interface IDestination {
  name: string;
  _id: string;
}

export interface IPackage {
  _id: string;
  name: string;
  amount: number;
  destinations: IDestination[];
  duration: {
    day: number;
    night: number;
  };
  specifications?: string[];
  activities?: string[];
  expiryDate?: string;
  operatorId?: string;
  remark?: string;
  createdAt?: string;
  isCustomizable?: boolean;
  discount?: number;
  availableSlots?: string[];
  images: string[];
  category?: string | ICategory;
}
export interface FormActivity extends Omit<IActivityDTO,'image'>{
    image:File|string
}
export interface FormOptionalActivity extends Omit<IOptionalActivityDTO,'image'>{
    image:File|string
}
export interface FormItineraryDay extends Omit<IItineraryDayDTO,'gallery'|'activities'|'optionalActivities'>{
gallery:(File|string)[];
activities:FormActivity[];
optionalActivities:FormOptionalActivity[]
}
export interface FormPackage extends Omit<PackageInput,'images'|'itinerary'>,BaseFormData{
images:(File|string)[];
itinerary:FormItineraryDay[];

}
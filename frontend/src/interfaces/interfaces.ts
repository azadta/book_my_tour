export interface FormField {
  id: string;
  type: string;
  placeholder?: string;
  label: string;
  options?: { label: string; value: string }[];
  multiple?: boolean;
  disabled?: boolean;
  required: boolean;
  readOnly?: boolean;
}

export interface Ilocation {
  latitude: number;
  longitude: number;
}

export interface Destination {
  _id: string;
  name: string;
  location: Ilocation;
  images: string[];
  createdAt: Date;
}

interface Operator {
  _id: string;
  name: string;
}
export interface ICategory {
  _id: string;
  name: string;
}

export interface IActivity {
  id: string;
  name: string;
  cost: number;
  customizable: boolean;
}

export interface IOptionalActivity {
  id: string;
  name: string;
  cost: number;
}

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
  gallery: string[];
  activities: IActivity[];
  optionalActivities: IOptionalActivity[];
}

export interface IPackageItem {
  _id: string;
  name: string;
  amount: number;
  destinations: Destination[];
  specifications?: string;

  startDate?: string;
  duration: { day: number; night: number };
  remark?: string;
  discount?: number;
  availableSlots?: string;
  images: string[];

  category: ICategory;
  operatorId?: Operator;
  itinerary: IItineraryDay[];
  createdAt?: string;
  updatedAt?: string;
}

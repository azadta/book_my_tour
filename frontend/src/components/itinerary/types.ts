export interface Activity {
  id: string;
  name: string;

  description: string;
  image: File | string;
  timing: {
    from: string;
    to: string;
  };
  cost: number;
  customizable: boolean;
}

export interface OptionalActivity {
  id: string;
  name: string;

  description: string;
  image: File | string;
  timing: {
    from: string;
    to: string;
  };
  cost: number;
}

export interface ItineraryDay {
  day: number;
  gallery: (File | string)[];
  activities: Activity[];
  optionalActivities: OptionalActivity[];
}

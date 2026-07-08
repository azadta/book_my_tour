export interface Activity {
  id: string;
  name: string;
  cost: number;
  customizable: boolean;
}

export interface OptionalActivity {
  id: string;
  name: string;
  cost: number;
}

export  interface ItineraryDay{
    day:number,
    title:string,
    description:string,
    gallery:(File|string)[],
    activities:Activity[],
    optionalActivities:OptionalActivity[]

}

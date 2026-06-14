import { IDestination } from "../models/Destination";
import { IBaseRepository } from "./IBaseRepository";

export interface IDestinationRepository extends IBaseRepository<IDestination>{

    findDestinationByName(name: string): Promise<IDestination | null>
   save(destination: IDestination): Promise<IDestination>
  

}
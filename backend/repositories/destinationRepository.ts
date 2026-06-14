import { injectable } from "inversify";
import { IDestinationRepository } from "../interfaces/IDestinationRepository";
import Destination, { IDestination } from "../models/Destination";
import { BaseRepository } from "./baseRepository";

@injectable()
export class DestinationRepository
  extends BaseRepository<IDestination>
  implements IDestinationRepository
{
  constructor() {
    super(Destination);
  }

  async findDestinationByName(name: string): Promise<IDestination | null> {
    return Destination.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
  }

  async save(destination: IDestination): Promise<IDestination> {
    return destination.save();
  }
}

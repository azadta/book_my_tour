import bcrypt from "bcryptjs";
import { injectable } from "inversify";
import { IHashService } from "../interfaces/IHashService";

@injectable()
export class BcryptHashService implements IHashService {
  private readonly saltRounds = 10;

  hash(data: string): string {
    return bcrypt.hashSync(data, this.saltRounds);
  }
  compare(data: string, encrypted: string): boolean {
    return bcrypt.compareSync(data, encrypted);
  }
}

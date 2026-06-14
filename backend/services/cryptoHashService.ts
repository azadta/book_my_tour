import crypto from "crypto";

import { injectable } from "inversify";
import { IHashGenerator } from "../interfaces/IHashGenerator";
@injectable()
export class CryptoHashService implements IHashGenerator {
  hash(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex");
  }
}

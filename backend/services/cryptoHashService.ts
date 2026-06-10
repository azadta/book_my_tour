import crypto from "crypto";

import { IHashGenerator } from "../interfaces/IHashGenerator";

export class CryptoHashService implements IHashGenerator {
  hash(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex");
  }
}

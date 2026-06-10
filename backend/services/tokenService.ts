import crypto from "crypto";
import {
  IResetTokenResponse,
  ITokenService,
} from "../interfaces/ITokenService";

export class TokenService implements ITokenService {
  getPasswordResetToken = (): IResetTokenResponse => {
    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expireTime = Date.now() + 10 * 60 * 1000;
    return { resetToken, hashedToken, expireTime };
  };
}

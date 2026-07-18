import { injectable } from "inversify";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  ISecurityPayload,
  ISecurityService,
} from "../interfaces/ISecurityService";
import { RESPONSE_MESSAGES } from "../constants/messages";
@injectable()
export class SecurityService implements ISecurityService {
  private get accessSecret(): string {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      throw new Error(
        RESPONSE_MESSAGES.SYSTEM.ERROR.MISSNG_ACCESS_SECRET,
      );
    }
    return accessSecret;
  }
  private get refreshSecret(): string {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      throw new Error(
        RESPONSE_MESSAGES.SYSTEM.ERROR.MISSING_REFRESH_SECRET,
      );
    }
    return refreshSecret;
  }
  generateAccessToken(payload: ISecurityPayload): string {
    return jwt.sign(payload, this.accessSecret, { expiresIn: "5m" });
  }
  verifyAccessToken(token: string): ISecurityPayload {
    const decoded = jwt.verify(token, this.accessSecret) as JwtPayload &
      ISecurityPayload;

    return {
      id: decoded.id,
      role: decoded.role,
    };
  }

  generateRefreshToken(payload: ISecurityPayload): string {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: "7d" });
  }
  verifyRefreshToken(token: string): ISecurityPayload {
    const decoded = jwt.verify(token, this.refreshSecret) as JwtPayload &
      ISecurityPayload;

    return {
      id: decoded.id,
      role: decoded.role,
    };
  }
}

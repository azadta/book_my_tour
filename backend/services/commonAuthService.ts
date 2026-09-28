import { inject, injectable } from "inversify";
import type { IAdminRepository } from "../interfaces/IAdminRepository";
import type { ICommonAuthService } from "../interfaces/ICommonAuthService";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { ISecurityService } from "../interfaces/ISecurityService";
import type { IUserRepository } from "../interfaces/IUserRepository";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";

@injectable()
export class CommonAuthService implements ICommonAuthService {
  constructor(
    @inject(Types.SecurityService) private _securityService: ISecurityService,
    @inject(Types.UserRepository) private _userRepository: IUserRepository,
    @inject(Types.OperatorRepository)
    private _operatorRepository: IOperatorRepository,
    @inject(Types.AdminRepository) private _adminRepository: IAdminRepository,
  ) {}

  refreshToken = async (token: string) => {
    const decoded = this._securityService.verifyRefreshToken(token);
    if (!decoded) {
      throw new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401);
    }
    let user;
    if (decoded.role === "user") {
      user = await this._userRepository.findById(decoded.id);
    }
    if (decoded.role === "operator") {
      user = await this._operatorRepository.findById(decoded.id);
    }
    if (decoded.role === "admin") {
      user = await this._adminRepository.findById(decoded.id);
    }
    if (!user || ("isBlocked" in user && user.isBlocked)) {
      throw new CustomError("UnAuthorized", 401);
    }
    const newAccessToken = this._securityService.generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });

    return { newAccessToken };
  };
}

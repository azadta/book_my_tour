import { inject, injectable } from "inversify";
import type { IAdminRepository } from "../interfaces/IAdminRepository";
import type { ICommonAuthService } from "../interfaces/ICommonAuthService";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { ISecurityService } from "../interfaces/ISecurityService";
import type { IUserRepository } from "../interfaces/IUserRepository";
import { CustomError } from "../utils/customError";
import { Types } from "../types/types";

@injectable()
export class CommonAuthService implements ICommonAuthService {
  constructor(
    @inject(Types.SecurityService) private securityService: ISecurityService,
    @inject(Types.UserRepository) private userRepository: IUserRepository,
    @inject(Types.OperatorRepository)
    private operatorRepository: IOperatorRepository,
    @inject(Types.AdminRepository) private adminRepository: IAdminRepository,
  ) {}

  refreshToken = async (token: string) => {
    const decoded = this.securityService.verifyRefreshToken(token);
    if (!decoded) {
      throw new CustomError("UnAuthorized, Please login again", 401);
    }
    let user;
    if (decoded.role === "user") {
      user = await this.userRepository.findById(decoded.id);
    }
    if (decoded.role === "operator") {
      user = await this.operatorRepository.findById(decoded.id);
    }
    if (decoded.role === "admin") {
      user = await this.adminRepository.findById(decoded.id);
    }
    if (!user || ("isBlocked" in user && user.isBlocked)) {
      throw new CustomError("UnAuthorized", 401);
    }
    const newAccessToken = this.securityService.generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });

    return { newAccessToken };
  };
}

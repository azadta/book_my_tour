import { IAdminRepository } from "../interfaces/IAdminRepository.js";
import { ICommonAuthService } from "../interfaces/ICommonAuthService.js";
import { IOperatorRepository } from "../interfaces/IOperatorRepository.js";
import { ISecurityService } from "../interfaces/ISecurityService.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";
import { CustomError } from "../utils/customError.js";

export class CommonAuthService implements ICommonAuthService {
  constructor(
    private securityService: ISecurityService,
    private userRepository: IUserRepository,
    private operatorRepository: IOperatorRepository,
    private adminRepository: IAdminRepository,
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
      id: user._id .toString(),
      role: user.role,
    });

 
    return { newAccessToken };
  };
}

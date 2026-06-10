import { IAdminRepository } from "../interfaces/IAdminRepository";
import { ICommonAuthService } from "../interfaces/ICommonAuthService";
import { IOperatorRepository } from "../interfaces/IOperatorRepository";
import { ISecurityService } from "../interfaces/ISecurityService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { CustomError } from "../utils/customError";

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

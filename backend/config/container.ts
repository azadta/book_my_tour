// import { UserController } from "../controllers/userController";

// import { UserRepository } from "../repositories/userRepository";

// import { BcryptHashService } from "../services/bcryptHashService";

// import { CryptoHashService } from "../services/cryptoHashService";
// import { MailService } from "../services/mailService";

// import { SecurityService } from "../services/securityService";
// import { TokenService } from "../services/tokenService";
// import { UserService } from "../services/userService";
// import { AuthMiddleware } from "../middlewares/authMiddleware";

// import { OperatorRepository } from "../repositories/operatorRepository";
// import { OperatorService } from "../services/operatorService";
// import { OperatorController } from "../controllers/operatorController";
// import { AdminController } from "../controllers/adminController";
// import { AdminService } from "../services/adminService";
// import { AdminRepository } from "../repositories/adminRepository";
// import { CommonAuthController } from "../controllers/commonAuthController";
// import { CommonAuthService } from "../services/commonAuthService";

// export const securityService = new SecurityService();
// const mailService = new MailService();
// const hashService = new BcryptHashService();

// const tokenService = new TokenService();
// const resetTokenHasher = new CryptoHashService();

// export const userRepository = new UserRepository();
// const userService = new UserService(
//   userRepository,
//   mailService,
//   hashService,
//   securityService,
//   tokenService,
//   resetTokenHasher,
// );
// export const userController = new UserController(userService);

// const operatorRepository = new OperatorRepository();
// const operatorService = new OperatorService(
//   operatorRepository,
//   mailService,
//   hashService,
//   securityService,
//   tokenService,
//   resetTokenHasher,
// );
// export const operatorController = new OperatorController(operatorService);

// const adminRepository = new AdminRepository();
// const adminService = new AdminService(
//   adminRepository,
//   mailService,
//   hashService,
//   securityService,
//   tokenService,
// );
// export const adminController = new AdminController(adminService);

// export const authMiddleware = new AuthMiddleware(
//   securityService,
//   userRepository,
//   operatorRepository,
//   adminRepository,
// );

// const commonAuthService = new CommonAuthService(
//   securityService,
//   userRepository,
//   operatorRepository,
//   adminRepository,
// );
// export const commonAuthController = new CommonAuthController(commonAuthService);

import "reflect-metadata";
import { Container } from "inversify";
import { Types } from "../types/types";
import { IUserRepository } from "../interfaces/IUserRepository";
import { UserRepository } from "../repositories/userRepository";
import { OperatorRepository } from "../repositories/operatorRepository";
import { IOperatorRepository } from "../interfaces/IOperatorRepository";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { AdminRepository } from "../repositories/adminRepository";
import { ISecurityService } from "../interfaces/ISecurityService";
import { SecurityService } from "../services/securityService";
import { IMailService } from "../interfaces/IMailService";
import { MailService } from "../services/mailService";
import { IHashService } from "../interfaces/IHashService";
import { BcryptHashService } from "../services/bcryptHashService";
import { IHashGenerator } from "../interfaces/IHashGenerator";
import { CryptoHashService } from "../services/cryptoHashService";
import { ITokenService } from "../interfaces/ITokenService";
import { TokenService } from "../services/tokenService";
import { IUserService } from "../interfaces/IUserService";
import { UserService } from "../services/userService";
import { IOperatorService } from "../interfaces/IOperatorService";
import { OperatorService } from "../services/operatorService";
import { IAdminService } from "../interfaces/IAdminService";
import { AdminService } from "../services/adminService";
import { ICommonAuthService } from "../interfaces/ICommonAuthService";
import { CommonAuthService } from "../services/commonAuthService";
import { IAdminController } from "../interfaces/IAdminController";
import { AdminController } from "../controllers/adminController";
import { IUserController } from "../interfaces/IUserController";
import { UserController } from "../controllers/userController";
import { IOperatorController } from "../interfaces/IOperatorController";
import { OperatorController } from "../controllers/operatorController";
import { ICommonAuthController } from "../interfaces/ICommonAuthController";
import { CommonAuthController } from "../controllers/commonAuthController";
import { IAuthMiddleware } from "../interfaces/IAuthMiddleware";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const container = new Container();

container
  .bind<IUserRepository>(Types.UserRepository)
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<IOperatorRepository>(Types.OperatorRepository)
  .to(OperatorRepository)
  .inSingletonScope();
container
  .bind<IAdminRepository>(Types.AdminRepository)
  .to(AdminRepository)
  .inSingletonScope();

container
  .bind<ISecurityService>(Types.SecurityService)
  .to(SecurityService)
  .inSingletonScope();
container
  .bind<IMailService>(Types.MailService)
  .to(MailService)
  .inSingletonScope();
container
  .bind<IHashService>(Types.BcryptHashService)
  .to(BcryptHashService)
  .inSingletonScope();
container
  .bind<IHashGenerator>(Types.CryptoHashService)
  .to(CryptoHashService)
  .inSingletonScope();
container
  .bind<ITokenService>(Types.TokenService)
  .to(TokenService)
  .inSingletonScope();

container
  .bind<IUserService>(Types.UserService)
  .to(UserService)
  .inSingletonScope();
container
  .bind<IOperatorService>(Types.OperatorService)
  .to(OperatorService)
  .inSingletonScope();
container
  .bind<IAdminService>(Types.AdminService)
  .to(AdminService)
  .inSingletonScope();
container
  .bind<ICommonAuthService>(Types.CommonAuthService)
  .to(CommonAuthService)
  .inSingletonScope();

container
  .bind<IAdminController>(Types.AdminController)
  .to(AdminController)
  .inSingletonScope();
container
  .bind<IUserController>(Types.UserController)
  .to(UserController)
  .inSingletonScope();
container
  .bind<IOperatorController>(Types.OperatorController)
  .to(OperatorController)
  .inSingletonScope();
container
  .bind<ICommonAuthController>(Types.CommonAuthController)
  .to(CommonAuthController)
  .inSingletonScope();
container
  .bind<IAuthMiddleware>(Types.AuthMiddleware)
  .to(AuthMiddleware)
  .inSingletonScope();

export const userController = container.get<IUserController>(
  Types.UserController,
);
export const adminController = container.get<IAdminController>(
  Types.AdminController,
);
export const operatorController = container.get<IOperatorController>(
  Types.OperatorController,
);
export const authMiddleware = container.get<IAuthMiddleware>(
  Types.AuthMiddleware,
);
export const commonAuthController = container.get<ICommonAuthController>(
  Types.CommonAuthController,
);

import { UserController } from "../controllers/userController";

import { UserRepository } from "../repositories/userRepository";

import { BcryptHashService } from "../services/bcryptHashService";

import { CryptoHashService } from "../services/cryptoHashService";
import { MailService } from "../services/mailService";

import { SecurityService } from "../services/securityService";
import { TokenService } from "../services/tokenService";
import { UserService } from "../services/userService";
import { AuthMiddleware } from "../middlewares/authMiddleware";

import { OperatorRepository } from "../repositories/operatorRepository";
import { OperatorService } from "../services/operatorService";
import { OperatorController } from "../controllers/operatorController";
import { AdminController } from "../controllers/adminController";
import { AdminService } from "../services/adminService";
import { AdminRepository } from "../repositories/adminRepository";
import { CommonAuthController } from "../controllers/commonAuthController";
import { CommonAuthService } from "../services/commonAuthService";

export const securityService = new SecurityService();
const mailService = new MailService();
const hashService = new BcryptHashService();

const tokenService = new TokenService();
const resetTokenHasher = new CryptoHashService();

export const userRepository = new UserRepository();
const userService = new UserService(
  userRepository,
  mailService,
  hashService,
  securityService,
  tokenService,
  resetTokenHasher,
);
export const userController = new UserController(userService);

const operatorRepository = new OperatorRepository();
const operatorService = new OperatorService(
  operatorRepository,
  mailService,
  hashService,
  securityService,
  tokenService,
  resetTokenHasher,
);
export const operatorController = new OperatorController(operatorService);

const adminRepository = new AdminRepository();
const adminService = new AdminService(
  adminRepository,
  mailService,
  hashService,
  securityService,
  tokenService,
);
export const adminController = new AdminController(adminService);

export const authMiddleware = new AuthMiddleware(
  securityService,
  userRepository,
  operatorRepository,
  adminRepository,
);

const commonAuthService = new CommonAuthService(
  securityService,
  userRepository,
  operatorRepository,
  adminRepository,
);
export const commonAuthController = new CommonAuthController(commonAuthService);

import { UserController } from "../controllers/userController.js";

import { UserRepository } from "../repositories/userRepository.js";

import { BcryptHashService } from "../services/bcryptHashService.js";

import { CryptoHashService } from "../services/cryptoHashService.js";
import { MailService } from "../services/mailService.js";

import { SecurityService } from "../services/securityService.js";
import { TokenService } from "../services/tokenService.js";
import { UserService } from "../services/userService.js";
import { AuthMiddleware } from "../utils/verifyRole.js";

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

export const authMiddleware = new AuthMiddleware(
  securityService,
  userRepository,
);

import { Container } from "inversify";
import "reflect-metadata";
import { AdminController } from "../controllers/adminController";
import { CommonAuthController } from "../controllers/commonAuthController";
import { OperatorController } from "../controllers/operatorController";
import { UserController } from "../controllers/userController";
import { WebhookController } from "../controllers/webhookController";
import { IAdminController } from "../interfaces/IAdminController";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { IAdminService } from "../interfaces/IAdminService";
import { IAuthMiddleware } from "../interfaces/IAuthMiddleware";
import { IBookingRepository } from "../interfaces/IBookingRepository";
import { ICommonAuthController } from "../interfaces/ICommonAuthController";
import { ICommonAuthService } from "../interfaces/ICommonAuthService";
import { ICouponRepository } from "../interfaces/ICouponRepository";
import { IDestinationRepository } from "../interfaces/IDestinationRepository";
import { IHashGenerator } from "../interfaces/IHashGenerator";
import { IHashService } from "../interfaces/IHashService";
import { IMailService } from "../interfaces/IMailService";
import { IOperatorController } from "../interfaces/IOperatorController";
import { IOperatorRepository } from "../interfaces/IOperatorRepository";
import { IOperatorService } from "../interfaces/IOperatorService";
import { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import { IPackageRepository } from "../interfaces/IPackageRepository";
import { IPaymentService } from "../interfaces/IPaymentService";
import { IReviewRepository } from "../interfaces/IReviewRepository";
import { ISecurityService } from "../interfaces/ISecurityService";
import { ITokenService } from "../interfaces/ITokenService";
import { IUserController } from "../interfaces/IUserController";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserService } from "../interfaces/IUserService";
import { IWebhookController } from "../interfaces/IWebhookController";
import { IWishlistRepository } from "../interfaces/IWishlistRepository";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { AdminRepository } from "../repositories/adminRepository";
import { BookingRepository } from "../repositories/bookingRepository";
import { CouponRepository } from "../repositories/couponRepository";
import { DestinationRepository } from "../repositories/destinationRepository";
import { OperatorRepository } from "../repositories/operatorRepository";
import { PackageCategoryRepository } from "../repositories/packageCategoryRepository";
import { PackageRepository } from "../repositories/packageRepository";
import { ReviewRepository } from "../repositories/reviewRepository";
import { UserRepository } from "../repositories/userRepository";
import { WishlistRepository } from "../repositories/wishlistRepository";
import { AdminService } from "../services/adminService";
import { BcryptHashService } from "../services/bcryptHashService";
import { CommonAuthService } from "../services/commonAuthService";
import { CryptoHashService } from "../services/cryptoHashService";
import { MailService } from "../services/mailService";
import { OperatorService } from "../services/operatorService";
import { RazorpayPaymentService } from "../services/RazorpayPaymentService";
import { SecurityService } from "../services/securityService";
import { TokenService } from "../services/tokenService";
import { UserService } from "../services/userService";
import { Types } from "../types/types";
import { WalletRepository } from "../repositories/walletRepository";
import { IWalletRepository } from "../interfaces/IWalletRepository";
import { IWalletService } from "../interfaces/IWalletService";
import { WalletService } from "../services/walletService";
import { IChatRepository } from "../interfaces/IChatRepository";
import { ChatRepository } from "../repositories/chatRepositories";
import { IMessageRepository } from "../interfaces/IMessageRepository";
import { MessageRepository } from "../repositories/messageRepository";
import { IChatService } from "../interfaces/IChatService";
import { ChatService } from "../services/chatService";
import { ISocketService } from "../interfaces/ISocketService";
import { SocketService } from "../services/SocketService";
import { IChatController } from "../interfaces/IChatController";
import { ChatController } from "../controllers/chatController";
import { INotificationRepository } from "../interfaces/INotificationRepository";
import { NotificationRepository } from "../repositories/notificationRepository";
import { INotificationService } from "../interfaces/INotificationService";
import { NotificationService } from "../services/notificationService";
import { INotificationController } from "../interfaces/INotificationController";
import { NotificationController } from "../controllers/notificationController";
import { IAdminDashboardService } from "../interfaces/IAdminDashboardService";
import { AdminDashboardService } from "../services/adminDashboardService";
import { IAdminOperatorService } from "../interfaces/IAdminOperatorService";
import { AdminOperatorService } from "../services/adminOperatorService";
import { IAdminUserService } from "../interfaces/IAdminUserService";
import { AdminUserService } from "../services/adminUserService";
import { IBookingService } from "../interfaces/IBookingService";
import { BookingService } from "../services/bookingService";
import { ICouponService } from "../interfaces/ICouponService";
import { CouponService } from "../services/couponService";
import { IOperatorDashboardService } from "../interfaces/IOperatorDashboard";
import { OperatorDashboardService } from "../services/operatorDashboardService";
import { IPackageCategoryService } from "../interfaces/IPackageCategoryService";
import { PackageCategoryService } from "../services/packageCategoryService";
import { IPackageDestinationService } from "../interfaces/IPackageDestinationService";
import { PackageDestinationService } from "../services/packageDestinationService";
import { IPackageReviewService } from "../interfaces/IPackageReviewService";
import { PackageReviewService } from "../services/packageReviewService";

import { IPackageService } from "../interfaces/IPackageService";
import { PackageService } from "../services/packageService";

import { WishlistService } from "../services/wishlistService";
import { IWishlistService } from "../interfaces/IWishlistService";

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
  .bind<IDestinationRepository>(Types.DestinationRepository)
  .to(DestinationRepository)
  .inSingletonScope();
container
  .bind<IPackageCategoryRepository>(Types.PackageCategoryRepository)
  .to(PackageCategoryRepository)
  .inSingletonScope();
container
  .bind<IPackageRepository>(Types.PackageRepository)
  .to(PackageRepository)
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
container
  .bind<IWishlistRepository>(Types.WishlistRepository)
  .to(WishlistRepository)
  .inSingletonScope();
container
  .bind<IReviewRepository>(Types.ReviewRepository)
  .to(ReviewRepository)
  .inSingletonScope();
container
  .bind<IPaymentService>(Types.PaymentService)
  .to(RazorpayPaymentService)
  .inSingletonScope();
container
  .bind<IBookingRepository>(Types.BookingRepository)
  .to(BookingRepository)
  .inSingletonScope();
container
  .bind<IWebhookController>(Types.WebhookController)
  .to(WebhookController)
  .inSingletonScope();
container
  .bind<ICouponRepository>(Types.CouponRepository)
  .to(CouponRepository)
  .inSingletonScope();
container
  .bind<IWalletRepository>(Types.WalletRepository)
  .to(WalletRepository)
  .inSingletonScope();
container
  .bind<IWalletService>(Types.WalletService)
  .to(WalletService)
  .inSingletonScope();
container
  .bind<IChatRepository>(Types.ChatRepository)
  .to(ChatRepository)
  .inSingletonScope();
container
  .bind<IMessageRepository>(Types.MessageRepository)
  .to(MessageRepository)
  .inSingletonScope();
container
  .bind<IChatService>(Types.ChatService)
  .to(ChatService)
  .inSingletonScope();
container
  .bind<ISocketService>(Types.SocketService)
  .to(SocketService)
  .inSingletonScope();
container
  .bind<IChatController>(Types.ChatController)
  .to(ChatController)
  .inSingletonScope();
container
  .bind<INotificationRepository>(Types.NotificationRepository)
  .to(NotificationRepository)
  .inSingletonScope();
container
  .bind<INotificationService>(Types.NotificationService)
  .to(NotificationService)
  .inSingletonScope();
container
  .bind<INotificationController>(Types.NotificationController)
  .to(NotificationController)
  .inSingletonScope();
container
  .bind<IAdminDashboardService>(Types.AdminDashboardService)
  .to(AdminDashboardService)
  .inSingletonScope();
container
  .bind<IAdminOperatorService>(Types.AdminOperatorService)
  .to(AdminOperatorService)
  .inSingletonScope();
container
  .bind<IAdminUserService>(Types.AdminUserService)
  .to(AdminUserService)
  .inSingletonScope();
container
  .bind<IBookingService>(Types.BookingService)
  .to(BookingService)
  .inSingletonScope();
container
  .bind<ICouponService>(Types.CouponService)
  .to(CouponService)
  .inSingletonScope();
container
  .bind<IOperatorDashboardService>(Types.OperatorDashboardService)
  .to(OperatorDashboardService)
  .inSingletonScope();
container
  .bind<IPackageCategoryService>(Types.PackageCategoryService)
  .to(PackageCategoryService)
  .inSingletonScope();
container
  .bind<IPackageDestinationService>(Types.PackageDestinationService)
  .to(PackageDestinationService)
  .inSingletonScope();
container
  .bind<IPackageReviewService>(Types.PackageReviewService)
  .to(PackageReviewService)
  .inSingletonScope();
container
  .bind<IWishlistService>(Types.WishlistService)
  .to(WishlistService)
  .inSingletonScope();
container
  .bind<IPackageService>(Types.PackageService)
  .to(PackageService)
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

export const webhookController = container.get<IWebhookController>(
  Types.WebhookController,
);

export const chatController = container.get<IChatController>(
  Types.ChatController,
);

export const notificationController = container.get<INotificationController>(
  Types.NotificationController,
);
export const socketService = container.get<ISocketService>(Types.SocketService);

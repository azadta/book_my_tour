import express from "express";
import { authMiddleware, wishlistController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const userRouter = express.Router();

userRouter.get(
  ROUTES.WISHLISTS.USER.LIST,
  authMiddleware.verifyRole("user"),
  wishlistController.getWishlists,
);
userRouter.post(
  ROUTES.WISHLISTS.USER.CREATE_GROUP,
  authMiddleware.verifyRole("user"),
  wishlistController.createWhishlistGroup,
);
userRouter.put(
  ROUTES.WISHLISTS.USER.UPDATE_GROUP,
  authMiddleware.verifyRole("user"),
  wishlistController.editWishlistGroup,
);
userRouter.delete(
  ROUTES.WISHLISTS.USER.DELETE_GROUP,
  authMiddleware.verifyRole("user"),
  wishlistController.deleteWishlistGroup,
);
userRouter.post(
  ROUTES.WISHLISTS.USER.TOGGLE,
  authMiddleware.verifyRole("user"),
  wishlistController.toggleWhishlistPackage,
);
userRouter.post(
  ROUTES.WISHLISTS.USER.ADD_NOTE,
  authMiddleware.verifyRole("user"),
  wishlistController.addWishlistNote,
);
userRouter.put(
  ROUTES.WISHLISTS.USER.UPDATE_NOTE,
  authMiddleware.verifyRole("user"),
  wishlistController.editWishlistNote,
);
userRouter.delete(
  ROUTES.WISHLISTS.USER.DELETE_NOTE,
  authMiddleware.verifyRole("user"),
  wishlistController.deleteWishlistNote,
);
userRouter.get(
  ROUTES.WISHLISTS.USER.SHARE_LINK,
  authMiddleware.verifyRole("user"),
  wishlistController.getWishlistShareLink,
);

export { userRouter };

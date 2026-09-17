import express from "express";
import { wishlistController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const publicRouter = express.Router();

publicRouter.get(
  ROUTES.WISHLISTS.PUBLIC.SHARED,
  wishlistController.getSharedWishlist,
);

export { publicRouter };

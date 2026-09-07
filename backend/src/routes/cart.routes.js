import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addToCartValidator, validate } from "../validators/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add/:productId/:variantId", protect, addToCartValidator, validate, addToCart);
cartRouter.get("/",protect,getCart);


export default cartRouter;

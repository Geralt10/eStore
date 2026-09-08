import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addToCartValidator, validate, incrementQuantityValidator, decrementQuantityValidator, removeFromCartValidator } from "../validators/cart.validator.js";
import { addToCart, getCart, incrementQuantity, decrementQuantity, removeFromCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add/:productId/:variantId", protect, addToCartValidator, validate, addToCart);
cartRouter.get("/",protect,getCart);
cartRouter.post("/quantity/increment/:productId/:variantId",protect,incrementQuantityValidator, validate,incrementQuantity);
cartRouter.post("/quantity/decrement/:productId/:variantId",protect,decrementQuantityValidator, validate,decrementQuantity);
cartRouter.delete("/:productId/:variantId",protect,removeFromCartValidator, validate,removeFromCart);

export default cartRouter;

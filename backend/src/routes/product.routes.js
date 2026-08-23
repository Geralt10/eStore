import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { createProduct, getSellerProduct } from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validators/product.validator.js";

const upload = multer({storage:multer.memoryStorage(),
    limits:{
        fileSize:1024*1024*5,
    }
});  


const productRouter = Router();

productRouter.post("/create",authorize,createProductValidator,upload.array("images",7),createProduct);

productRouter.get("/seller",authorize,getSellerProduct);

export default productRouter;
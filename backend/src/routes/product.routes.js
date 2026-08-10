import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
import multer from "multer";

const upload = multer({storage:multer.memoryStorage(),
    limits:{
        fileSize:1024*1024*5,
    }
});  


const productRouter = Router();

productRouter.post("/create",authorize,upload.array("images",7),createProduct);

export default productRouter;
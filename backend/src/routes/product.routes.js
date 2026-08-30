import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { createProduct, getAllProducts, getProduct, getSellerProduct, addVariant, updateVariantStock} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validators/product.validator.js";

const upload = multer({storage:multer.memoryStorage(),
    limits:{
        fileSize:1024*1024*5,
    }
});  


const productRouter = Router();

productRouter.post("/create",authorize,upload.array("images",7),createProductValidator,createProduct);

productRouter.get("/seller",authorize,getSellerProduct);

productRouter.get("/",getAllProducts);

productRouter.get("/:id",getProduct);

// Variant management routes
productRouter.post("/:id/variant", authorize, upload.array("images", 5), addVariant);
productRouter.patch("/:id/variant/:variantId/stock", authorize, updateVariantStock);


export default productRouter;
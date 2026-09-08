import { body, param, validationResult } from "express-validator";

export const addToCartValidator = [
    param("productId").isMongoId().withMessage("Invalid Product ID"),
    param("variantId").isMongoId().withMessage("Invalid Variant ID"),
    body("quantity").optional().isInt({min:1}).withMessage("Quantity must be at least 1")
];

export const incrementQuantityValidator = [
    param("productId").isMongoId().withMessage("Invalid Product ID"),
    param("variantId").isMongoId().withMessage("Invalid Variant ID"),
];

export const decrementQuantityValidator = [
    param("productId").isMongoId().withMessage("Invalid Product ID"),
    param("variantId").isMongoId().withMessage("Invalid Variant ID"),
];

export const removeFromCartValidator = [
    param("productId").isMongoId().withMessage("Invalid Product ID"),
    param("variantId").isMongoId().withMessage("Invalid Variant ID"),
];



export const validate = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
};
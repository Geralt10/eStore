import { body,validationResult } from "express-validator";

function validateRequeset(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success:false,
            message:errors.array()[0]?.msg || "Validation Error",
            errors: errors.array()
        });
    }
    next();
}


export const createProductValidator = [
        body("title").notEmpty().withMessage("Title is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("priceAmount").notEmpty().withMessage("Price amount is required").isNumeric().withMessage("Price amount must be a number"),
        body("priceCurrency").optional().isIn(["USD","EUR","GBP","JPY","INR"]).withMessage("Invalid currency"),
        validateRequeset
];
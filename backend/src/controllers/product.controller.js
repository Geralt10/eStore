import productModel from "../models/product.model.js";



export async function createProduct(req,res) {
    console.log(req.user);
    res.send("create product");
    
}
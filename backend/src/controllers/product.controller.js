import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";



export async function createProduct(req,res) {
    
    try {
        const {title,description,priceAmount,priceCurrency} = req.body;

    const seller = req.user;

    const images = await Promise.all(req.files.map(async(file)=>{
        return await uploadFile({
            buffer:file.buffer,
            fileName:file.originalname,
        })
    }));

    const products = await productModel.create({
        title,
        description,
        price:{ amount:Number(priceAmount),currency:priceCurrency || "INR" },
        seller:seller._id,
        image:images.map((image)=>({url:image.url})),
    })

    return res.status(201).json({
        success:true,
        message:"Product created successfully",
        products,
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
    
}

export async function getSellerProduct(req,res){
    try {
        const seller = req.user;

        const products = await productModel.find({seller:seller._id});
        
        return res.status(200).json({
            success:true,
            message:"Product fetched successfully",
            products,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
}

export async function getAllProducts(req,res){
    try {

        const products = await productModel.find();

        return res.status(200).json({
            success:true,
            message:"Product fetched successfully",
            products,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
}

export async function getProduct(req,res) {
    try {
        const {id} = req.params;

        const product = await productModel.findById(id);

        return res.status(200).json({
            success:true,
            message:"Product fetched successfully",
            product,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
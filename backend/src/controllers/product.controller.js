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

export async function addVariant(req, res) {
    try {
        const { id } = req.params;
        const { stock, priceAmount, priceCurrency, attributes } = req.body;
        const seller = req.user;

        const product = await productModel.findOne({ _id: id, seller: seller._id });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
        }

        let parsedAttributes = attributes;
        if (typeof attributes === "string") {
            try {
                parsedAttributes = JSON.parse(attributes);
            } catch (e) {
                parsedAttributes = {};
            }
        }

        let images = [];
        if (req.files && req.files.length > 0) {
            images = await Promise.all(
                req.files.map(async (file) => {
                    const uploaded = await uploadFile({
                        buffer: file.buffer,
                        fileName: file.originalname,
                    });
                    return { url: uploaded.url };
                })
            );
        } else if (product.image && product.image.length > 0) {
            images = [product.image[0]];
        }

        const newVariant = {
            images,
            stock: Number(stock) || 0,
            attributes: parsedAttributes || {},
            priceOverride: {
                amount: priceAmount ? Number(priceAmount) : product.price.amount,
                currency: priceCurrency || product.price.currency || "INR",
            },
        };

        product.varients.push(newVariant);
        await product.save();

        return res.status(201).json({
            success: true,
            message: "Variant created successfully",
            product,
            variant: product.varients[product.varients.length - 1],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function updateVariantStock(req, res) {
    try {
        const { id, variantId } = req.params;
        const { stock } = req.body;
        const seller = req.user;

        const product = await productModel.findOne({ _id: id, seller: seller._id });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
        }

        const variant = product.varients.id(variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        variant.stock = Math.max(0, Number(stock) || 0);
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            product,
            variant,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


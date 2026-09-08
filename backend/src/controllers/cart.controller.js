import { stockOfVariant } from "../dao/product.dao.js";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";


export const addToCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const product = await productModel.findOne({
            _id: productId,
            "varients._id": variantId,
        });

        const { quantity = 1 } = req.body;

        if (!product) {
            return res.status(404).json({ message: "product not found", success: false });
        }

        const variant = product.varients.id(variantId);
        const price = variant?.priceOverride?.amount ? variant.priceOverride : product.price;

        const stock = await stockOfVariant(productId, variantId);

        let cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            cart = await cartModel.create({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === product._id.toString() && item.variant.toString() === variantId.toString()
        );

        if (existingItem) {
            const quantityInCart = existingItem.quantity;

            if (quantityInCart + quantity > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items are available and you already have ${quantityInCart} items in your cart.`,
                    success: false,
                });
            }

            existingItem.quantity += quantity;
            await cart.save();

            return res.status(200).json({
                message: "Item added to cart successfully",
                success: true,
                cart,
            });
        }

        if (quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items are available in stock.`,
                success: false,
            });
        }

        cart.items.push({
            product: productId,
            variant: variantId,
            quantity,
            price,
        });

        await cart.save();

        return res.status(200).json({
            message: "Item added to cart successfully",
            success: true,
            cart,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getCart = async(req,res)=>{
    try {
        let cart = await cartModel.findOne({user:req.user._id}).populate("items.product");
        
        if(!cart){
            cart = await cartModel.create({user:req.user._id});
        }

        return res.status(200).json({
            message:"Cart fetched successfully",
            success:true,
            cart,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
}


export const incrementQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const cart = await cartModel.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const existingItem = cart.items.find(
            (item) =>
                item.product.toString() === productId &&
                (
                    variantId
                        ? item.variant?.toString() === variantId
                        : !item.variant
                )
        );

        if (!existingItem) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        const stock = await stockOfVariant(productId, variantId);

        if (existingItem.quantity >= stock) {
            return res.status(400).json({
                message: `Only ${stock} items are available in stock.`,
                success: false
            });
        }

        existingItem.quantity += 1;

        await cart.save();

        return res.status(200).json({
            message: "Quantity incremented successfully",
            success: true,
            cart
        });

    } catch (error) {
        console.error("Increment quantity error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const decrementQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const cart = await cartModel.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const existingItem = cart.items.find(
            (item) =>
                item.product.toString() === productId &&
                (
                    variantId
                        ? item.variant?.toString() === variantId
                        : !item.variant
                )
        );

        if (!existingItem) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        if (existingItem.quantity <= 1) {
            cart.items = cart.items.filter(
                (item) => item._id.toString() !== existingItem._id.toString()
            );

            await cart.save();

            return res.status(200).json({
                message: "Item removed from cart",
                success: true,
                cart
            });
        }

        existingItem.quantity -= 1;

        await cart.save();

        return res.status(200).json({
            message: "Quantity decremented successfully",
            success: true,
            cart
        });

    } catch (error) {
        console.error("Decrement quantity error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


export const removeFromCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const cart = await cartModel.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const existingItem = cart.items.find(
            (item) =>
                item.product.toString() === productId &&
                (
                    variantId
                        ? item.variant?.toString() === variantId
                        : !item.variant
                )
        );

        if (!existingItem) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        cart.items = cart.items.filter(
            (item) => item._id.toString() !== existingItem._id.toString()
        );

        await cart.save();

        return res.status(200).json({
            message: "Item removed from cart",
            success: true,
            cart
        });

    } catch (error) {
        console.error("Remove from cart error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

import mongoose from "mongoose";
import priceSchema from "./price.Schema.js";

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {
           product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product",
            required:true
           },
           variant:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product.variants",
            required:true
           },
           quantity:{
            type:Number,
            default:1
           },
           price:{
            type:priceSchema,
            required:true
           }
        }
    ]
},{timestamps:true})   

const cartModel = mongoose.model("Cart",cartSchema);

export default cartModel;
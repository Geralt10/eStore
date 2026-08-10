import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";


export async function protect(req, res, next) {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try  {
        const decoded = jwt.verify(token, config.JWT_SECRET);
    
        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(401).json({message:"Unauthorized"});
        }

        req.user = user;
        next();    
    }catch(error){
        console.error("Protect Error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
}

export async function authorize(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    
    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);
    
        const user = await userModel.findById(decoded.id);

        if(user.role !== "seller"){
            return res.status(403).json({message:"Forbidden"});
        }
        req.user = user;
        next();    
    }catch(error){
        console.error("Authorize Error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
}
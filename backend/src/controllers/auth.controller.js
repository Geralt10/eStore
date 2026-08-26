import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js"

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("token", token);

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    });
}

export async function registerController(req, res) {
    const { email, password, fullname, contact, isSeller } = req.body;

    try {
        const existingUser = await userModel.findOne({
            $or: [{ email }, { contact }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or contact already exists" });
        }

        const user = await userModel.create({
            email,
            password,
            fullname,
            contact,
            role: isSeller ? "seller" : "buyer"
        });

        await sendTokenResponse(user, res, "User registered successfully");

    } catch (error) {
        console.error("Register Controller Error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
}

export async function loginController(req, res) {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        await sendTokenResponse(user, res, "User logged in successfully");
    } catch (error) {
        console.error("Login Controller Error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
}

export async function googleCallbackController(req, res) {
    
    const {id,displayName,emails} = req.user;
    const email = emails[0].value;
   

    let user = await userModel.findOne({email});

    if(!user){
        user = await userModel.create({
            email,
            fullname:displayName,
            googleId:id
        })
    }

    const token = jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:"7d"});

    res.cookie("token",token);

    res.redirect("http://localhost:5173/");    
       
}   

export async function getMeController(req,res) {
    try {
        const user = req.user;
       
        res.status(200).json({
            message:"User fetched successfully",
            user:{
                id:user._id,
                email:user.email,
                contact:user.contact,
                fullname:user.fullname,
                role:user.role
            }
        });
    } catch (error) {
        console.error("Get Me Controller Error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
}

export async function logoutController(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Logout Controller Error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
}

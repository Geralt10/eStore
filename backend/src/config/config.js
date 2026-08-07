import dotenv from "dotenv";

dotenv.config()


if(!process.env.MONGO_URI){
    throw new Error("MONGODB_URI is not defined in environment variables");
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables")
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
}    
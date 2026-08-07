import { Router } from "express";
import { registerController } from "../controllers/auth.controller.js";
import { validateRegisterUser } from "../validators/auth.validator.js";



const authRouter = Router();


authRouter.post("/register",validateRegisterUser,registerController)


export default authRouter;
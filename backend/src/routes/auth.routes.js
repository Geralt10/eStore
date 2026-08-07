import { Router } from "express";
import { registerController ,loginController} from "../controllers/auth.controller.js";
import { validateRegisterUser, validateLoginUser } from "../validators/auth.validator.js";



const authRouter = Router();


authRouter.post("/register",validateRegisterUser,registerController)
authRouter.post("/login",validateLoginUser,loginController)

export default authRouter;
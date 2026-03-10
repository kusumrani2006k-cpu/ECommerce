import { Router } from "express";
import {register, login, logout, getCurrentUser} from '../controller/user.controller.js'
import {upload} from "../middleware/multer.middleware.js"
import {verifyJWT} from '../middleware/auth.middlewares.js'


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "profile",
            maxCount : 1
        }
    ]),
    register)

router.route("/login").post(login)
 router.route("/logout").post(verifyJWT, logout)
 router.route("/get").get(verifyJWT, getCurrentUser)


export default router;
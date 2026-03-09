import { Router } from "express";
import {register} from '../controller/user.controller.js'
import {upload} from "../middleware/multer.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "profile",
            maxCount : 1
        }
    ]),
    register)


export default router;
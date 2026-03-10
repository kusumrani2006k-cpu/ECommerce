import { Router } from "express";
import { createProduct, getProductById, getProducts } from "../controller/product.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import {verifyJWT} from '../middleware/auth.middlewares.js'

const router = Router()

router.route("/").get(getProducts)
router.route("/:id").get(getProductById)
router.route("/create").post(upload.single("image"), createProduct)

export default router
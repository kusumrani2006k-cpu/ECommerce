import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import {Product} from '../models/product.models.js'


const createProduct = asyncHandler(async (req, res) => {

    const { name, price, stock, description } = req.body

    if (!name || !price || !stock || !description) {
        throw new ApiError(400, "All fields are required")
    }

    const imageFile = req.file

    if (!imageFile) {
        throw new ApiError(400, "Product image is required")
    }

    const uploadedImage = await uploadOnCloudinary(imageFile)

    if (!uploadedImage) {
        throw new ApiError(500, "Image upload failed")
    }

    const product = await Product.create({
        vendorid: req.user?._id, // vendor id from auth middleware
        name,
        price,
        stock,
        description,
        image: uploadedImage.secure_url
    })

    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully")
    )

})

const getProducts = asyncHandler(async (req, res) => {

    const products = await Product.find()
        .populate("vendorid", "name email")
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, products, "Products fetched successfully")
    )

})

const getProductById = asyncHandler(async (req, res) => {

    const { id } = req.params

    const product = await Product.findById(id)
        .populate("vendorid", "name email")

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully")
    )

})


export {
    createProduct,
    getProductById,
    getProducts
}
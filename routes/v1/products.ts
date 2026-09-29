import { Router } from "express";
import { productValidation, checkValidation } from "../../middleware/validate";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/productController";

const router = Router();

// GET - Fetch all products
router.get("/", getAllProducts);

// GET - Fetch product by ID
router.get("/:id", getProductById);

// POST - Create a new product
router.post("/", productValidation, checkValidation, createProduct);

// PUT - Update an existing product
router.put("/:id", productValidation, checkValidation, updateProduct);

// DELETE - Remove a product
router.delete("/:id", deleteProduct);

export default router;

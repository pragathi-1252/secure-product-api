import asyncHandler from "../middleware/asyncHandler";
import AppError from "../utils/AppError";
import { products, generateProductId } from "../models/product";
import type { Product } from "../models/product";
import sendResponse from "../utils/sendResponse";
// GET - Fetch all products
export const getAllProducts = asyncHandler((req, res) => {
  sendResponse(res, 200, "Products fetched successfully", products);
});

// GET - Fetch product by ID
export const getProductById = asyncHandler((req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  sendResponse(res, 200, "Product fetched successfully", product);
});

// POST - Create a new product
export const createProduct = asyncHandler((req, res) => {
  const product: Product = {
    id: generateProductId(),
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    stock: req.body.stock,
    description: req.body.description || "",
  };

  products.push(product);

  sendResponse(res, 201, "Product created successfully", product);
});

// PUT - Update an existing product
export const updateProduct = asyncHandler((req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new AppError("Product not found", 404);
  }

  const updatedProduct: Product = {
    id,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    stock: req.body.stock,
    description: req.body.description || "",
  };

  products[index] = updatedProduct;

  sendResponse(res, 200, "Product updated successfully", updatedProduct);
});

// DELETE - Remove a product
export const deleteProduct = asyncHandler((req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new AppError("Product not found", 404);
  }

  products.splice(index, 1);

  res.status(204).send();
});

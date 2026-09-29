
import { Router } from "express";
import {
  productValidation,
  checkValidation,
} from "../../middleware/validate";
import AppError from "../../utils/AppError";
import type { Request, Response, NextFunction } from "express";

const router = Router();

// Temporary in-memory product storage
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
}

let products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 55000,
    category: "Electronics",
    stock: 10,
    description: "High-performance laptop",
  },
];

let nextId = 2;

// GET - Fetch all products
// GET - Fetch all products
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

// GET - Fetch product by ID
router.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const product = products.find((p) => p.id === id);

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST - Create a new product
// POST - Create a new product
router.post(
  "/",
  productValidation,
  checkValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product: Product = {
        id: nextId++,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        description: req.body.description || "",
      };

      products.push(product);

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
);
// PUT - Update an existing product
// PUT - Update an existing product
router.put(
  "/:id",
  productValidation,
  checkValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }
);
// DELETE - Remove a product
// DELETE - Remove a product
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const index = products.findIndex((p) => p.id === id);

      if (index === -1) {
        throw new AppError("Product not found", 404);
      }

      products.splice(index, 1);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);
export default router;
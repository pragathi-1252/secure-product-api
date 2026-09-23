import { Router } from "express";
import {productValidation, checkValidation,} from "../../middleware/validate";
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Products fetched successfully",
    data: [],
  });
});
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (id !== 1) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Product fetched successfully",
    data: {
      id: 1,
      name: "Laptop",
      price: 55000,
      category: "Electronics",
      stock: 10,
      description: "High-performance laptop",
    },
  });
});
router.post(
  "/",
  productValidation,
  checkValidation,
  (req, res) => {
    const product = {
      id: 2,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      description: req.body.description || "",
    };

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Product created successfully",
      data: product,
    });
  }
);
router.put(
  "/:id",
  productValidation,
  checkValidation,
  (req, res) => {
    const id = Number(req.params.id);

    if (id !== 1) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Product not found",
      });
    }

    const updatedProduct = {
      id: id,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      description: req.body.description || "",
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  }
);
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (id !== 1) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Product not found",
    });
  }

  res.status(204).send();
});
export default router;
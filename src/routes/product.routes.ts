import { Router, Request, Response } from "express";

import { validationResult } from "express-validator";

import { products } from "../data/products";

import { productValidation } from "../validators/product.validator";

const router = Router();

// GET all products
router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    data: products,
  });
});

// GET product by ID
router.get("/:id", (req, res) => {
  const productId = Number(req.params.id);

  const product = products.find(
    (product) => product.id === productId
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
});

// POST create a new product
router.post(
  "/",
  productValidation,
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const newId =
      products.length > 0
        ? Math.max(...products.map((product) => product.id)) + 1
        : 1;

    const newProduct = {
      id: newId,
      ...req.body,
    };

    products.push(newProduct);

    return res.status(201).json({
      success: true,
      data: newProduct,
    });
  }
);

// PUT update a product
router.put(
  "/:id",
  productValidation,
  (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    const productIndex = products.findIndex(
      (product) => product.id === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    products[productIndex] = {
      ...products[productIndex],
      ...req.body,
      id: productId,
    };

    return res.status(200).json({
      success: true,
      data: products[productIndex],
    });
  }
);

// DELETE a product
router.delete("/:id", (req, res) => {
  const productId = Number(req.params.id);

  const productIndex = products.findIndex(
    (product) => product.id === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  products.splice(productIndex, 1);

  return res.status(204).send();
});

export default router;
import { Request, Response, NextFunction, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Product } from "../entity/Product";
import { parse } from "csv-parse/sync";

const validateSingleProduct = (product: Partial<Product>): string | null => {
  if (!product.name || product.name.trim() === "")
    return "Product name cannot be empty.";
  if (!product.description || product.description.trim() === "")
    return "Product description cannot be empty.";
  if (
    product.priceUnit === undefined ||
    typeof product.priceUnit !== "number" ||
    product.priceUnit <= 0
  )
    return "Price of product must be greater than 0.";
  if (
    product.weightUnit === undefined ||
    typeof product.weightUnit !== "number" ||
    product.weightUnit <= 0
  )
    return "Weigth of product must be greater than 0.";
  return null;
};

export const validateProductMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validateSingleProduct(req.body);
  if (error)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  next();
};

export const validateProductsArray = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products: Partial<Product>[] = Array.isArray(req.body)
    ? req.body
    : parse(req.body);

  for (const p of products) {
    const error = validateSingleProduct(p);
    if (error)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }

  next();
};

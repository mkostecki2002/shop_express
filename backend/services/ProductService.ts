import { Request, Response, NextFunction, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Product } from "../entity/Product";
import { parse } from "csv-parse/sync";

const validateSingleProduct = (product: Partial<Product>): string | null => {
  console.log("Validating product:", product);
  if (!product.name || product.name.trim() === "")
    return "Product name cannot be empty.";
  if (!product.description || product.description.trim() === "")
    return "Product description cannot be empty.";
  if (product.priceUnit === undefined)
    return "Price of product must be defined.";
  if (product.weightUnit === undefined)
    return "Weigth of product must be defined.";

  if (typeof product.priceUnit !== "number" || isNaN(product.priceUnit)) {
    return "Price of product must be a number.";
  }
  if (typeof product.weightUnit !== "number" || isNaN(product.weightUnit)) {
    return "Weigth of product must be a number.";
  }

  if (product.priceUnit < 0) return "Price of product cannot be negative.";
  if (product.weightUnit < 0) return "Weigth of product cannot be negative.";

  return null;
};

export const validateProductMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = validateSingleProduct(req.body);
  if (error)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  next();
};

export const validateProductsArray = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const products: Partial<Product>[] = Array.isArray(req.body)
    ? req.body
    : parse(req.body, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (value, context) => {
          if (context.header) return value;

          if (
            context.column === "priceUnit" ||
            context.column === "weightUnit"
          ) {
            const num = parseFloat(value);
            return isNaN(num) ? null : num;
          }

          if (context.column === "category") {
            return { name: value };
          }

          return value;
        },
      });
  for (const p of products) {
    const error = validateSingleProduct(p);
    if (error)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  }

  next();
};

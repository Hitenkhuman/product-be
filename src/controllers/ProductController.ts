import { Request, Response, NextFunction } from 'express';
import ProductService, { ProductQueryOptions } from '@/services/ProductService';
import { CreateProductDto } from '@/types/dtos/productDto';
import { RESPONSE_MESSAGES } from '@/utils/constants';
import ResponseHandler from '@/utils/responseHandler';

//TODO: method should go to interfaces and then it should be implemented in the service/controller
class ProductController {
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productData: CreateProductDto = req.body;

      // Mock the server failure like if mat.random() is > 0.5 then throw an error for development purpose
      if (Math.random() > 0.5) {
        throw new Error('Server failure for development purpose');
      }
      //TODO: Add validation for the productData

      const product = await ProductService.createProduct(productData);

      ResponseHandler.created(res, product, RESPONSE_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = req.query;

      //TODO: Handle query params later for now return all the products
      const options: ProductQueryOptions = {
        all: query.all === 'true',
      };

      const products = await ProductService.getAllProducts(options);

      ResponseHandler.success(res, {
        data: products,
        message: RESPONSE_MESSAGES.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();

import { Product, IProduct } from '@/models/Product';
import { CreateProductDto } from '@/types/dtos/productDto';
import { API_CONFIG } from '@/utils/constants';


export interface ProductQueryOptions {
  all?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ProductService {
  async createProduct(productData: CreateProductDto): Promise<IProduct> {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error: any) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async getAllProducts(options: ProductQueryOptions): Promise<IProduct[]> {
    // const {
    //   page = 1,
    //   limit = API_CONFIG.DEFAULT_PAGE_SIZE,
    //   sortBy = 'createdAt',
    //   sortOrder = 'desc',
    // } = {};

    // const skip = (page - 1) * limit;
    //for now if all is true then return all the products else return only the products that are on sale
    let query = Product.find({ isActive: true, ...(options.all ? {} : { isOnSale: true }) });

    // Apply sorting
    // const sortOptions: any = {};
    // sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    // query = query.sort(sortOptions);

    // // Execute query with pagination
    // const [products, totalItems] = await Promise.all([
    //   query.skip(skip).limit(limit).exec(),
    //   Product.countDocuments(query.getQuery()),
    // ]);

    // const totalPages = Math.ceil(totalItems / limit);

    return await query.exec();

  }
}

export default new ProductService(); 
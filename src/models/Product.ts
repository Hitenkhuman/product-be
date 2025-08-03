import { Schema, model } from 'mongoose';
import { IBaseModel, baseSchemaFields, baseSchemaOptions, addBaseQuery } from './BaseModel';

export interface IProduct extends IBaseModel {
  name: string;
  category: string;
  price: number;
  description: string;
  isOnSale: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    ...baseSchemaFields,
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
      index: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    isOnSale: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  baseSchemaOptions
);

// Add compound indexes for better query performance
productSchema.index({ category: 1, isOnSale: 1 });
productSchema.index({ price: 1, isOnSale: 1 });
productSchema.index({ name: 'text', description: 'text' }); // Text search index

// Add base query helpers
(addBaseQuery as any)(productSchema);

export const Product = model<IProduct>('Product', productSchema); 
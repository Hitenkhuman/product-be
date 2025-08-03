import { Schema, Document, Query } from 'mongoose';

export interface IBaseModel extends Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Query helper types
interface QueryHelpers {
  active(): Query<any[], any>;
  inactive(): Query<any[], any>;
}

export const baseSchemaFields = {
  isActive: {
    type: Boolean,
    default: true,
  },
};

export const baseSchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (_doc: any, ret: any): any => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    transform: (_doc: any, ret: any): any => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
};

// Common query helpers
export const addBaseQuery = (schema: Schema<any, any, any, QueryHelpers>): void => {
  // Add query helpers for filtering active records
  schema.query.active = function(this: Query<any[], any>) {
    return this.where({ isActive: true });
  };

  schema.query.inactive = function(this: Query<any[], any>) {
    return this.where({ isActive: false });
  };
}; 
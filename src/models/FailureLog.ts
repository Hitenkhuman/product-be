import { Schema, model } from 'mongoose';
import { IBaseModel, baseSchemaFields, baseSchemaOptions, addBaseQuery } from './BaseModel';
import { ErrorType, OriginType } from '@/types/schemaHelper';


export interface IFailureLog extends IBaseModel {
  message: string;
  origin: OriginType;
  trace: any; // Can be string or object depending on the error
  path: string;
  type: ErrorType;
  userInfo?: Record<string, any>; // Optional field for FE errors
  metadata?: Record<string, any>; // Additional context data
}

const failureLogSchema = new Schema<IFailureLog>(
  {
    ...baseSchemaFields,
    message: {
      type: String,
      required: [true, 'Error message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    origin: {
      type: String,
      required: [true, 'Origin is required'],
      enum: {
        values: Object.values(OriginType),
        message: 'Origin must be either FE, BE, or OTHER'
      },
    },
    trace: {
      type: Schema.Types.Mixed,
      required: [true, 'Stack trace is required']
    },
    path: {
      type: String,
      required: [true, 'Path is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Error type is required'],
      enum: {
        values: Object.values(ErrorType),
        message: 'Type must be critical, normal, warning, or info'
      },
      default: ErrorType.NORMAL,
    },
    userInfo: {
      type: Schema.Types.Mixed,
      default: {}
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    ...baseSchemaOptions,
    collection: 'failureLogs'
  }
);

// Add base query helpers
(addBaseQuery as any)(failureLogSchema);

export const FailureLog = model<IFailureLog>('FailureLog', failureLogSchema);

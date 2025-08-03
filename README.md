# Product Backend API

A robust TypeScript-based Node.js backend API built with Express and MongoDB, featuring comprehensive error handling, validation, and security best practices.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast and minimalist web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **Security**: Helmet, CORS, compression, and input validation
- **Error Handling**: Centralized error handling with failure logging
- **Validation**: Request validation using Joi
- **Logging**: Morgan for HTTP request logging and custom failure logging
- **Code Quality**: ESLint and Prettier configuration with TypeScript support
- **Modular Architecture**: Clean separation of concerns with services layer

## 📁 Project Structure

```
src/
├── config/
│   └── connectDb.ts             # Database connection configuration
├── controllers/
│   ├── ProductController.ts     # Product route handlers
│   └── FailureLogController.ts  # Failure log route handlers
├── middlewares/
│   ├── auth.ts                  # Authentication middleware
│   ├── cors.ts                  # CORS configuration
│   └── globalErrorHandler.ts   # Global error handling
├── models/
│   ├── BaseModel.ts             # Base model with common fields
│   ├── Product.ts               # Product model
│   └── FailureLog.ts            # Failure log model
├── routes/
│   ├── index.ts                 # Main routes aggregator
│   ├── productRoutes.ts         # Product-specific routes
│   └── failureLogRoutes.ts      # Failure log routes
├── services/
│   ├── ProductService.ts        # Product business logic
│   └── FailureLogService.ts     # Failure log business logic
├── types/
│   ├── dtos/                    # Data transfer objects
│   ├── interfaces/              # Type interfaces
│   ├── global.d.ts              # Global type definitions
│   ├── response.types.ts        # Response type definitions
│   └── schemaHelper.ts          # Schema validation helpers
├── utils/
│   ├── constants.ts             # Application constants
│   ├── logServerFailure.ts      # Server failure logging utility
│   └── responseHandler.ts       # Standardized response handler
├── index.ts                     # Application entry point
└── server.ts                    # Express server configuration
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/product-db
   JWT_SECRET=your-super-secret-jwt-key
   API_VERSION=v1
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Run the application**
   ```bash
   # Development mode with hot reload
   npm run dev

   # Production build
   npm run build
   npm start

   # Lint code
   npm run lint

   # Fix linting issues
   npm run lint:fix

   # Type checking
   npm run type-check
   ```

## 📦 Dependencies

### Production Dependencies
- **compression**: HTTP compression middleware
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management
- **express**: Web application framework
- **helmet**: Security middleware for HTTP headers
- **joi**: Data validation library
- **mongoose**: MongoDB object modeling
- **morgan**: HTTP request logger

### Development Dependencies
- **TypeScript**: Static type checking
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **ts-node-dev**: Development server with hot reload
- **tsconfig-paths**: Path mapping support

## 📋 API Endpoints

### Health Check
- `GET /health` - Check API status

### Products
- `POST /api/products` - Create a new product (requires authentication)
- `GET /api/products` - Get all products (requires authentication)

### Failure Logs
- `POST /api/failure-logs` - Create a failure log entry (requires authentication)

## 💾 Data Models

### Product Model
```typescript
{
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  isOnSale: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Failure Log Model
```typescript
{
  _id: string;
  message: string;
  origin: 'FE' | 'BE' | 'OTHER';
  trace: any; // string or object
  path: string;
  type: 'critical' | 'normal' | 'warning' | 'info';
  userInfo?: Record<string, any>;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Security Features

- **Helmet**: Secure HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Compression**: HTTP response compression
- **Authentication**: JWT-based authentication middleware
- **Input Validation**: Joi schema validation
- **Error Handling**: Centralized error handling with failure logging

## 🧪 Development

### Available Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript to JavaScript
npm run start      # Start production server
npm run lint       # Run ESLint on source files
npm run lint:fix   # Fix ESLint issues automatically
npm run type-check # Run TypeScript type checking without emitting files
```

### Code Quality Tools

- **ESLint**: TypeScript linting with strict rules (@typescript-eslint)
- **Prettier**: Code formatting with ESLint integration
- **TypeScript**: Strict type checking (v5.3.3)
- **Path Mapping**: Clean imports with tsconfig-paths

## 🌐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/product-db | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `API_VERSION` | API version | v1 | No |
| `ALLOWED_ORIGINS` | CORS allowed origins | http://localhost:3000,http://localhost:3001 |

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Start the production server**
   ```bash
   npm start
   ```

## ⚙️ System Requirements

- **Node.js**: >= 18.0.0
- **MongoDB**: >= 4.4
- **npm**: >= 8.0.0

## 📄 License

This project is licensed under the MIT License. 
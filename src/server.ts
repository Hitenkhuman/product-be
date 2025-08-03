import express, { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import routes from '@/routes';
import globalErrorHandler from '@/middlewares/globalErrorHandler';
import cors from '@/middlewares/cors';

const createServer = (): Application => {
  const app: Application = express();

  // Security middleware
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // CORS middleware
  app.use(cors);


  // Compression middleware
  app.use(compression());

  // Logging middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Routes
  app.use('/', routes);

  // Global error handling middleware (must be last)
  app.use(globalErrorHandler);

  return app;
};

export default createServer; 
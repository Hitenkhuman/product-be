import dotenv from 'dotenv';
import createServer from './server';
import connectDB from '@/config/connectDb';
import { logCriticalFailure } from '@/utils/logServerFailure';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const app = createServer();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });

    const gracefulShutdown = (): void => {
      console.log('\n🔄 Received shutdown signal, shutting down gracefully...');
      
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    
    // Log critical failure to database
    logCriticalFailure({
      message: 'Server startup failure',
      error: error,
      path: 'startServer',
      metadata: {
        port: PORT,
        nodeEnv: process.env.NODE_ENV || 'development',
        processInfo: {
          pid: process.pid,
          platform: process.platform,
          nodeVersion: process.version,
          memoryUsage: process.memoryUsage()
        }
      }
    }).catch(logError => {
      console.error('Failed to log server startup failure to database:', logError);
    }).finally(() => {
      process.exit(1);
    });
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  
  // Log critical failure to database
  logCriticalFailure({
    message: 'Unhandled Promise Rejection',
    error: reason,
    path: 'process.unhandledRejection',
    metadata: {
      promiseInfo: promise.toString(),
      processInfo: {
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage()
      }
    }
  }).catch(logError => {
    console.error('Failed to log unhandled rejection to database:', logError);
  }).finally(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  
  // Log critical failure to database
  logCriticalFailure({
    message: 'Uncaught Exception',
    error: error,
    path: 'process.uncaughtException',
    metadata: {
      processInfo: {
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage()
      }
    }
  }).catch(logError => {
    console.error('Failed to log uncaught exception to database:', logError);
  }).finally(() => {
    process.exit(1);
  });
});

// Start the server
startServer(); 
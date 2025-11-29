import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fileUpload from 'express-fileupload';
import authRoutes, { authRouter } from './routes/auth.routes';
import listingRoutes from './routes/listing.routes';
import categoryRoutes from './routes/category.routes';
import bookingRoutes from './routes/booking.routes';
import commentRoutes from './routes/comment.routes';
import wishlistRoutes from './routes/wishlist.routes';
import claimRoutes from './routes/claim.routes';
import postRoutes from './routes/post.routes';
import mediaRoutes from './routes/media.routes';
import settingRoutes from './routes/setting.routes';
import homeRoutes from './routes/home.routes';
import { errorHandler } from './middlewares/error.middleware';
import { updateProfile, changePassword } from './controllers/auth.controller';
import { authenticate } from './middlewares/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Handle multipart/form-data for file uploads
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  abortOnLimit: false,
  parseNested: true,
  debug: false,
  uploadTimeout: 60000,
}));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
const adminAssetsPath = path.join(__dirname, '../admin');
app.use('/admin', express.static(adminAssetsPath));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes - WordPress compatible endpoints
app.use('/wp-json/jwt-auth/v1', authRoutes);
app.use('/wp-json/listar/v1/auth', authRouter);
app.use('/wp-json/listar/v1', listingRoutes);
app.use('/wp-json/listar/v1', categoryRoutes);
app.use('/wp-json/listar/v1', bookingRoutes);
app.use('/wp-json/listar/v1', commentRoutes);
app.use('/wp-json/listar/v1', wishlistRoutes);
app.use('/wp-json/listar/v1', claimRoutes);
app.use('/wp-json/listar/v1', postRoutes);
app.use('/wp-json/wp/v2', mediaRoutes);
app.use('/wp-json/listar/v1', settingRoutes);
app.use('/wp-json/listar/v1', homeRoutes);

// WordPress users endpoint for profile updates
app.post('/wp-json/wp/v2/users/me', authenticate, updateProfile);
app.post('/wp-json/wp/v2/users/me/password', authenticate, changePassword);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 ListarPro Backend running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/wp-json`);
});

export default app;

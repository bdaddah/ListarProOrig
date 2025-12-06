import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { AppError } from './error.middleware';
import prisma from '../utils/db';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401, 'jwt_auth_no_token');
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    req.user = payload;
    next();
  } catch (error: any) {
    if (error.message === 'Invalid or expired token') {
      return next(new AppError('Invalid or expired token', 403, 'jwt_auth_invalid_token'));
    }
    next(error);
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);
      req.user = payload;
    }
    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true, userLevel: true, active: true },
    });

    if (!user || !user.active) {
      throw new AppError('Unauthorized', 401);
    }

    // Check admin access by role or legacy userLevel
    const isAdmin = user.role === 'admin' || user.userLevel >= 10;
    if (!isAdmin) {
      throw new AppError('Admin access required', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

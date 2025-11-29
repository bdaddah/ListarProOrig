import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new AppError('Username and password are required', 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: username },
        { displayName: username },
      ],
    },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 403, 'invalid_username');
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 403, 'incorrect_password');
  }

  if (!user.active) {
    throw new AppError('Account is deactivated', 403, 'account_deactivated');
  }

  const token = generateToken({ userId: user.id, email: user.email });

  res.json({
    success: true,
    data: {
      token,
      id: user.id,
      email: user.email,
      name: user.displayName || `${user.firstName} ${user.lastName}`.trim(),
      display_name: user.displayName,
      first_name: user.firstName,
      last_name: user.lastName,
      user_photo: user.image,
      user_url: user.url,
      user_level: user.userLevel,
      description: user.description,
    },
  });
});

// Register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, first_name, last_name } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        ...(username ? [{ displayName: username }] : []),
      ],
    },
  });

  if (existingUser) {
    throw new AppError('User already exists', 400, 'user_exists');
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      displayName: username || email.split('@')[0],
      firstName: first_name,
      lastName: last_name,
    },
  });

  res.json({
    success: true,
    code: 200,
    message: 'Registration successful',
    msg: 'Registration successful. Please login.',
  });
});

// Validate Token
export const validateToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    code: 'jwt_auth_valid_token',
    message: 'Token is valid',
  });
});

// Get User
export const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      displayName: true,
      image: true,
      url: true,
      userLevel: true,
      description: true,
      tag: true,
      createdAt: true,
      listings: {
        select: { id: true },
      },
      comments: {
        select: { id: true },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Calculate ratings from user's listings
  const listingsWithRatings = await prisma.listing.aggregate({
    where: { userId: user.id },
    _avg: { ratingAvg: true },
    _count: { id: true },
  });

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.displayName || `${user.firstName} ${user.lastName}`.trim(),
      display_name: user.displayName,
      first_name: user.firstName,
      last_name: user.lastName,
      user_photo: user.image,
      user_url: user.url,
      user_level: user.userLevel,
      description: user.description,
      tag: user.tag,
      rating_avg: listingsWithRatings._avg.ratingAvg || 0,
      total_comment: user.comments.length,
      total: user.listings.length,
    },
  });
});

// Update Profile
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { first_name, last_name, description, url, user_photo } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      ...(first_name && { firstName: first_name }),
      ...(last_name && { lastName: last_name }),
      ...(description && { description }),
      ...(url && { url }),
      ...(user_photo && { image: user_photo }),
      displayName: first_name && last_name ? `${first_name} ${last_name}` : undefined,
    },
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    id: updatedUser.id,
  });
});

// Change Password
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { password, new_password } = req.body;

  if (!password || !new_password) {
    throw new AppError('Current and new password are required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new AppError('Current password is incorrect', 403, 'incorrect_password');
  }

  const hashedPassword = await hashPassword(new_password);

  await prisma.user.update({
    where: { id: req.user.userId },
    data: { password: hashedPassword },
  });

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

// Forgot Password
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Return success even if user not found (security best practice)
    return res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
    });
  }

  // TODO: Implement email sending with reset token
  // For now, just return success
  res.json({
    success: true,
    message: 'Password reset instructions sent to your email',
  });
});

// Request OTP
export const requestOTP = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Generate OTP (6 digits)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expTime = Date.now() + 10 * 60 * 1000; // 10 minutes

  // TODO: Store OTP in cache/database and send via email
  // For now, return mock response
  res.json({
    success: true,
    data: {
      exp_time: expTime,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Only in dev
    },
    message: 'OTP sent to your email',
    msg: 'OTP sent successfully',
  });
});

// Deactivate Account
export const deactivateAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  await prisma.user.update({
    where: { id: req.user.userId },
    data: { active: false },
  });

  res.json({
    success: true,
    message: 'Account deactivated successfully',
  });
});

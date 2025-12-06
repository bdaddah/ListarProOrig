import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  generateResetToken,
  getTokenExpiration,
  sendPasswordResetEmail,
  sendOTPEmail,
} from '../utils/email';

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

  // Determine if user is admin
  const isAdmin = user.role === 'admin' || user.userLevel >= 10;

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
      role: user.role,
      is_admin: isAdmin,
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
      role: true,
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

  // Determine if user is admin
  const isAdmin = user.role === 'admin' || user.userLevel >= 10;

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
      role: user.role,
      is_admin: isAdmin,
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
  const { email, code } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Security: Always return success message even if user not found
  if (!user) {
    return res.json({
      success: true,
      message: 'If the email exists, a password reset code has been sent',
    });
  }

  // If code is provided, this is a verification request (from OTP screen)
  if (code) {
    // Find valid reset token that matches the code (first 6 chars uppercase)
    const resetRecords = await prisma.passwordReset.findMany({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    const resetRecord = resetRecords[0];
    if (!resetRecord) {
      throw new AppError('Invalid or expired reset code', 400, 'invalid_code');
    }

    // Check if code matches (first 6 chars of token)
    const expectedCode = resetRecord.token.substring(0, 6).toUpperCase();
    if (code.toUpperCase() !== expectedCode) {
      throw new AppError('Invalid reset code', 400, 'invalid_code');
    }

    // Code is valid - return success with token for password reset
    return res.json({
      success: true,
      message: 'Code verified successfully',
      data: {
        reset_token: resetRecord.token,
      },
    });
  }

  // Invalidate any existing reset tokens for this user
  await prisma.passwordReset.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  // Generate new reset token
  const resetToken = generateResetToken();
  const expiresAt = getTokenExpiration();

  // Store reset token in database
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: resetToken,
      expiresAt,
    },
  });

  // Send reset email
  const userName = user.displayName || user.firstName || user.email.split('@')[0];
  const emailSent = await sendPasswordResetEmail(user.email, userName, resetToken);

  if (!emailSent && process.env.NODE_ENV !== 'development') {
    throw new AppError('Failed to send reset email. Please try again later.', 500);
  }

  // Return response indicating OTP is required (mobile app will show OTP screen)
  res.json({
    success: true,
    code: 'auth_otp_require',
    message: 'Password reset code sent to your email',
  });
});

// Reset Password (set new password using token)
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, token, new_password } = req.body;

  if (!email || !token || !new_password) {
    throw new AppError('Email, token, and new password are required', 400);
  }

  if (new_password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid email or token', 400);
  }

  // Find valid reset token
  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      userId: user.id,
      token,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!resetRecord) {
    throw new AppError('Invalid or expired reset token', 400, 'invalid_token');
  }

  // Hash new password
  const hashedPassword = await hashPassword(new_password);

  // Update password and mark token as used
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    }),
  ]);

  res.json({
    success: true,
    message: 'Password reset successfully. You can now login with your new password.',
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

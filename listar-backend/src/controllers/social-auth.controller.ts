import { Request, Response } from 'express';
import prisma from '../utils/db';
import { generateToken } from '../utils/jwt';
import { hashPassword } from '../utils/password';
import { AppError, asyncHandler } from '../middlewares/error.middleware';
import crypto from 'crypto';

// Types for social auth payloads
interface SocialAuthPayload {
  provider: 'google' | 'facebook' | 'twitter' | 'yahoo' | 'apple';
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  image?: string;
  accessToken: string;
  idToken?: string; // For Google/Apple
}

// Verify Google token
const verifyGoogleToken = async (idToken: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );
    if (!response.ok) {
      throw new Error('Invalid Google token');
    }
    const data = await response.json();

    // Verify the token is for our app
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && data.aud !== clientId) {
      throw new Error('Token not issued for this application');
    }

    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
      displayName: data.name,
      image: data.picture,
      emailVerified: data.email_verified === 'true',
    };
  } catch (error: any) {
    console.error('Google token verification error:', error);
    throw new AppError('Invalid Google token', 401, 'invalid_google_token');
  }
};

// Verify Facebook token
const verifyFacebookToken = async (accessToken: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,email,first_name,last_name,name,picture.type(large)&access_token=${accessToken}`
    );
    if (!response.ok) {
      throw new Error('Invalid Facebook token');
    }
    const data = await response.json();

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      displayName: data.name,
      image: data.picture?.data?.url,
    };
  } catch (error: any) {
    console.error('Facebook token verification error:', error);
    throw new AppError('Invalid Facebook token', 401, 'invalid_facebook_token');
  }
};

// Verify Twitter token (OAuth 2.0)
const verifyTwitterToken = async (accessToken: string): Promise<any> => {
  try {
    const response = await fetch(
      'https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Invalid Twitter token');
    }
    const result = await response.json();
    const data = result.data;

    return {
      id: data.id,
      displayName: data.name,
      username: data.username,
      image: data.profile_image_url?.replace('_normal', ''),
    };
  } catch (error: any) {
    console.error('Twitter token verification error:', error);
    throw new AppError('Invalid Twitter token', 401, 'invalid_twitter_token');
  }
};

// Verify Yahoo token (OpenID Connect)
const verifyYahooToken = async (accessToken: string): Promise<any> => {
  try {
    const response = await fetch(
      'https://api.login.yahoo.com/openid/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Invalid Yahoo token');
    }
    const data = await response.json();

    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
      displayName: data.name,
      image: data.picture,
    };
  } catch (error: any) {
    console.error('Yahoo token verification error:', error);
    throw new AppError('Invalid Yahoo token', 401, 'invalid_yahoo_token');
  }
};

// Verify Apple token
const verifyAppleToken = async (idToken: string): Promise<any> => {
  try {
    // Decode the JWT without verification first to get the payload
    // In production, you should verify the signature using Apple's public keys
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid Apple token format');
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );

    // Verify issuer and audience
    if (payload.iss !== 'https://appleid.apple.com') {
      throw new Error('Invalid Apple token issuer');
    }

    const clientId = process.env.APPLE_CLIENT_ID;
    if (clientId && payload.aud !== clientId) {
      throw new Error('Token not issued for this application');
    }

    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Apple token expired');
    }

    return {
      id: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
    };
  } catch (error: any) {
    console.error('Apple token verification error:', error);
    throw new AppError('Invalid Apple token', 401, 'invalid_apple_token');
  }
};

// Generate a random password for social auth users
const generateRandomPassword = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Build user response
const buildUserResponse = (user: any, token: string) => ({
  success: true,
  data: {
    token,
    id: user.id,
    email: user.email,
    name: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    display_name: user.displayName,
    first_name: user.firstName,
    last_name: user.lastName,
    user_photo: user.image,
    user_url: user.url,
    user_level: user.userLevel,
    description: user.description,
    auth_provider: user.authProvider,
  },
});

// Social Login Handler
export const socialLogin = asyncHandler(async (req: Request, res: Response) => {
  const { provider, access_token, id_token, user_data } = req.body;

  if (!provider) {
    throw new AppError('Provider is required', 400);
  }

  if (!access_token && !id_token) {
    throw new AppError('Access token or ID token is required', 400);
  }

  let socialUser: any;

  // Verify token based on provider
  switch (provider.toLowerCase()) {
    case 'google':
      socialUser = await verifyGoogleToken(id_token || access_token);
      break;
    case 'facebook':
      socialUser = await verifyFacebookToken(access_token);
      break;
    case 'twitter':
      socialUser = await verifyTwitterToken(access_token);
      break;
    case 'yahoo':
      socialUser = await verifyYahooToken(access_token);
      break;
    case 'apple':
      socialUser = await verifyAppleToken(id_token || access_token);
      // Apple only provides name on first login, use user_data if provided
      if (user_data) {
        socialUser.firstName = user_data.firstName || socialUser.firstName;
        socialUser.lastName = user_data.lastName || socialUser.lastName;
        socialUser.displayName = user_data.displayName ||
          `${user_data.firstName || ''} ${user_data.lastName || ''}`.trim() ||
          socialUser.displayName;
      }
      break;
    default:
      throw new AppError(`Unsupported provider: ${provider}`, 400);
  }

  if (!socialUser || !socialUser.id) {
    throw new AppError('Failed to verify social token', 401);
  }

  // Build provider ID field name
  const providerIdField = `${provider.toLowerCase()}Id` as keyof typeof prisma.user;

  // Find existing user by social ID or email
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { [providerIdField]: socialUser.id },
        ...(socialUser.email ? [{ email: socialUser.email }] : []),
      ],
    },
  });

  if (user) {
    // Update social ID if not set
    const updateData: any = {};
    if (!user[providerIdField as keyof typeof user]) {
      updateData[providerIdField] = socialUser.id;
    }
    // Update image if user doesn't have one
    if (!user.image && socialUser.image) {
      updateData.image = socialUser.image;
    }
    // Update email verification if verified via social
    if (socialUser.emailVerified && !user.emailVerified) {
      updateData.emailVerified = true;
    }

    if (Object.keys(updateData).length > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    if (!user.active) {
      throw new AppError('Account is deactivated', 403, 'account_deactivated');
    }
  } else {
    // Create new user
    if (!socialUser.email) {
      throw new AppError(
        'Email is required for registration. Please grant email permission.',
        400,
        'email_required'
      );
    }

    const hashedPassword = await hashPassword(generateRandomPassword());

    user = await prisma.user.create({
      data: {
        email: socialUser.email,
        password: hashedPassword,
        firstName: socialUser.firstName,
        lastName: socialUser.lastName,
        displayName: socialUser.displayName || socialUser.email.split('@')[0],
        image: socialUser.image,
        emailVerified: socialUser.emailVerified || false,
        authProvider: provider.toLowerCase(),
        [providerIdField]: socialUser.id,
      },
    });
  }

  // Generate JWT token
  const token = generateToken({ userId: user.id, email: user.email });

  res.json(buildUserResponse(user, token));
});

// Link social account to existing user
export const linkSocialAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const { provider, access_token, id_token } = req.body;

  if (!provider || (!access_token && !id_token)) {
    throw new AppError('Provider and token are required', 400);
  }

  let socialUser: any;

  switch (provider.toLowerCase()) {
    case 'google':
      socialUser = await verifyGoogleToken(id_token || access_token);
      break;
    case 'facebook':
      socialUser = await verifyFacebookToken(access_token);
      break;
    case 'twitter':
      socialUser = await verifyTwitterToken(access_token);
      break;
    case 'yahoo':
      socialUser = await verifyYahooToken(access_token);
      break;
    case 'apple':
      socialUser = await verifyAppleToken(id_token || access_token);
      break;
    default:
      throw new AppError(`Unsupported provider: ${provider}`, 400);
  }

  const providerIdField = `${provider.toLowerCase()}Id`;

  // Check if this social account is already linked to another user
  const existingUser = await prisma.user.findFirst({
    where: { [providerIdField]: socialUser.id },
  });

  if (existingUser && existingUser.id !== userId) {
    throw new AppError(
      'This social account is already linked to another user',
      400,
      'social_account_in_use'
    );
  }

  // Link the social account
  const user = await prisma.user.update({
    where: { id: userId },
    data: { [providerIdField]: socialUser.id },
  });

  res.json({
    success: true,
    message: `${provider} account linked successfully`,
    data: {
      provider: provider.toLowerCase(),
      linked: true,
    },
  });
});

// Unlink social account
export const unlinkSocialAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const { provider } = req.body;

  if (!provider) {
    throw new AppError('Provider is required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if user has a password (can still login after unlinking)
  // or has another social account linked
  const providerIdField = `${provider.toLowerCase()}Id` as keyof typeof user;
  const socialProviders = ['googleId', 'facebookId', 'twitterId', 'yahooId', 'appleId'];
  const linkedProviders = socialProviders.filter(
    (p) => user[p as keyof typeof user] && p !== providerIdField
  );

  if (linkedProviders.length === 0 && user.authProvider !== 'local') {
    throw new AppError(
      'Cannot unlink the only authentication method. Please set a password first.',
      400,
      'cannot_unlink_only_auth'
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { [providerIdField]: null },
  });

  res.json({
    success: true,
    message: `${provider} account unlinked successfully`,
    data: {
      provider: provider.toLowerCase(),
      linked: false,
    },
  });
});

// Get linked social accounts
export const getLinkedAccounts = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleId: true,
      facebookId: true,
      twitterId: true,
      yahooId: true,
      appleId: true,
      authProvider: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: {
      google: !!user.googleId,
      facebook: !!user.facebookId,
      twitter: !!user.twitterId,
      yahoo: !!user.yahooId,
      apple: !!user.appleId,
      auth_provider: user.authProvider,
    },
  });
});

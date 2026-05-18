import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncWrapper } from '../utils/asyncWrapper';
import { env } from '../config/env';
import { IUserPayload } from '../types/auth';

const signToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const register = asyncWrapper(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already in use');

  const user = await User.create({ name, email, password, role });

  const payload: IUserPayload = { id: user._id.toString(), email: user.email, role: user.role };
  const token = signToken(payload);

  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const payload: IUserPayload = { id: user._id.toString(), email: user.email, role: user.role };
  const token = signToken(payload);

  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const getMe = asyncWrapper(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');

  res.json({ success: true, user });
});

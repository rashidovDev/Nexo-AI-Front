"use server"
import { IUser } from '@/types';
import jwt from 'jsonwebtoken';

export const generateToken  = async (user? : IUser) => {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!secret) {
        throw new Error('NEXT_PUBLIC_JWT_SECRET is not defined');
    }
    const token = jwt.sign({ userId: user?._id }, secret, { expiresIn: '1h' });
    return token;
}
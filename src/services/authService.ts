import { LoginType } from "../validations/authSchema";
import { BadRequestError, NotFoundError, UnauthorizedError } from '../common/errors';
import prisma from '../lib/prismaClient';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, TokenPayload, verifyRefreshToken } from "../common/auth/jwtToken";

export async function loginService(data: LoginType) {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if(user)
    {
        // password verification
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
           throw new UnauthorizedError('Invalid email or password');
        }
        const payload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        // tokens generation
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // let's store refresh token in db
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { refresh_token: refreshToken },
            select: {
                id: true,
                user_name: true,
                email: true,
                role: true,
            }
        });

        return {
            user: updatedUser,
            accessToken,
            refreshToken
        };

    }
    throw new NotFoundError('User not found');
}

export async function logoutService(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if(!user) {
        throw new NotFoundError('User not found');
    }

    // remove refresh token from db
    await prisma.user.update({
        where: { id: userId },
        data: { refresh_token: '' },
    });

    return;
}

export async function refreshTokenService(token: string) {
    let verified: TokenPayload;

    try{
         verified =  await verifyRefreshToken(token);
    }
    catch(error)
    {
        throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await prisma.user.findUnique({
        where: { id : verified?.userId },
        select: {
            id: true,
            email: true,
            role: true,
            refresh_token: true,
        }
    });

    if(!user || user.refresh_token !== token) {
        throw new UnauthorizedError('Unauthorized Access');
    }

    const payload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
    }

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // update refresh token in db
    await prisma.user.update({
        where: { id: user.id },
        data: { refresh_token: newRefreshToken },
    });
    
    return {newAccessToken, newRefreshToken};
}
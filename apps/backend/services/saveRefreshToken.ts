import argon2 from "argon2"
import jwt from "jsonwebtoken"
import { RefreshToken } from "@/model/refreshToken.model"
import {v4 as UUID} from  "uuid"

interface SaveRefreshTokenArgs{
    userID: string;
    refreshToken: string;
    tokenId: string
}

export async function saveRefreshToken({
    userID,
    refreshToken,
    tokenId,
}: SaveRefreshTokenArgs) {



    const tokenHash = await argon2.hash(refreshToken);

    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload

    if(!decoded?.exp) {
        throw new Error("Invalid refresh token");
    }

    await RefreshToken.create({
        userID,
        tokenId,
        tokenHash,
        expiresAt: new Date(decoded.exp * 1000),
    })
}
import jwt from "jsonwebtoken"
import { UserInfo } from "@/model/user.model"
import { v4 as uuid } from "uuid"



export function signAccessToken(user: UserInfo) {
    return jwt.sign({
        sub: user._id.toString(),
        roles: user.roles,
        status: user.status
    },
     process.env.ZYNORA_JWT_ACCESS_SECRET as string, 
    {
        expiresIn: "15m"
    })
}

export function signRefreshToken(user: UserInfo) {
    const tokenId = uuid()
    const token =  jwt.sign(
        {
            sub: user._id.toString(),
            tokenId,
            tokenVersion: user.tokenVersion
        },

        process.env.ZYNORA_JWT_REFRESH_SECRET as string,

        {
            expiresIn: "30d"
        }
    )

    return {token, tokenId}
}
import { parse, serialize } from "cookie";
import jwt from "jsonwebtoken";
import { User } from "@/model/user.model";
import { RefreshToken } from "@/model/refreshToken.model";
import { signAccessToken, signRefreshToken } from "@/utils/token";
import { saveRefreshToken } from "@/services/saveRefreshToken";
import argon2 from "argon2";
import { GraphQLError } from "graphql/error/GraphQLError";

export const refreshResolver = {
  Mutation: {
    refreshAccessToken: async (_: any, __: any, ctx: any) => {
      const cookieHeader = ctx.request.headers.get("cookie") || "";
      const cookies = parse(cookieHeader);
      const oldRefreshToken = cookies.refreshToken;

      if (!oldRefreshToken) throw new Error("No refresh token provided");

      try {
        // 1. Verify JWT
        const decoded = jwt.verify(
          oldRefreshToken,
          process.env.ZYNORA_JWT_REFRESH_SECRET!,
        ) as { sub: string; tokenId: string; tokenVersion: number };

        const user = await User.findById(String(decoded.sub));
        if (!user || decoded.tokenVersion !== user.tokenVersion) {
          throw new Error("Invalid session");
        }

        // 2. Check Database for token
        const savedToken = await RefreshToken.findOne({
          tokenId: decoded.tokenId,
        });
        if (!savedToken || savedToken.expiresAt < new Date()) {
          throw new Error("Token expired or not found");
        }

        // 3. Verify Hash
        const isValid = await argon2.verify(
          savedToken.tokenHash,
          oldRefreshToken,
        );
        if (!isValid) throw new Error("Invalid token hash");

        // 4. Cleanup old token
        await RefreshToken.deleteOne({ _id: savedToken._id });

        // 5. Generate new pair
        const newAccessToken = signAccessToken(user);
        const { token: newRefreshToken, tokenId } = signRefreshToken(user);

        await saveRefreshToken({
          userID: user._id,
          refreshToken: newRefreshToken,
          tokenId,
        });

        // 6. Set Cookies via Yoga response
        await ctx.request.cookieStore.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 15 * 60,
        });

        await ctx.request.cookieStore.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
        });

        console.log("TOKEN refresHED");

        return {
          success: true,
          message: "Token refreshed",
        };
      } catch (error: any) {
        await ctx.request.cookieStore.set("accessToken", "", {
          httpOnly: true,
          secure: false,
          sameSite: "none",
          path: "/",
          maxAge: 0, // 👈 clear
        });

        await ctx.request.cookieStore.set("refreshToken", "", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 0, // 👈 clear
        });
        throw new Error(error.message || "Refresh failed");
      }
    },

    logout: async (_: any, __: any, ctx: any) => {
      const { request, user } = ctx;
      if (!user) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const cookieHeader = request.headers.get("cookie") || "";
      const cookies = parse(cookieHeader);
      const oldRefreshToken = cookies.refreshToken;

      try {
        if (oldRefreshToken) {
          const decoded = jwt.verify(
            oldRefreshToken,
            process.env.ZYNORA_JWT_REFRESH_SECRET!,
          ) as { tokenId: string };

          await RefreshToken.deleteMany({ userID: user._id });
        }
      } catch (error) {
        console.error("Logout error:", error);
      }

      user.tokenVersion += 1;
      await user.save();

      await ctx.request.cookieStore.set("accessToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 0,
      });

      await ctx.request.cookieStore.set("refreshToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 0,
      });

      return {
        success: true,
        message: "Logged out successfully",
      };
    },
  },
};

import { OtpService } from "@/services/otpService";
import { User } from "@/model/user.model";

import { getClientIp } from "@/utils/clientIP";
import { signAccessToken, signRefreshToken } from "@/utils/token";
import { saveRefreshToken } from "@/services/saveRefreshToken";
import { serialize } from "cookie";
import { mergeCarts } from "@/utils/cart/mergeCart";

interface SendOtpArgs {
  data: {
    identifier: string;
    deviceId: string;
  };
}

interface VerifyOtpArgs {
  data: {
    identifier: string;
    otp: string;
    token: string;
  };
}

export const signupResolver = {
  Mutation: {
    sendOtp: async (
      _: unknown,
      { data }: SendOtpArgs,
      { request, req }: { request: any; req: any },
    ) => {
      const ip = await getClientIp(request, req);

      console.log(`🚀 Request from IP: ${ip}`);

      const result = await OtpService.sendOtp(
        data.identifier,
        data.deviceId,
        ip,
      );
      return result;
    },

    verifyOtp: async (
      _: unknown,
      { data }: VerifyOtpArgs,
      ctx: any,
    ): Promise<{ success: boolean; message: string }> => {
      const { identifier, otp } = data;

      const result = await OtpService.verifyOtp(identifier, otp);
      if (!result.success) throw new Error(result.message);

      const isPhone = /^[6-9]\d{9}$/.test(identifier);

      const query = isPhone ? { phone: identifier } : { email: identifier };

      let user = await User.findOne(query);

      if (!user) {
        user = await User.create({
          ...(isPhone ? { phone: identifier } : { email: identifier }),
          roles: ["USER"],
          status: "ACTIVE",
          isPhoneVerified: isPhone,
          isEmailVerified: !isPhone,
          tokenVersion: 0,
        });
      } else {
        if (isPhone) user.isPhoneVerified = true;
        else user.isEmailVerified = true;
        await user.save();
      }

      const cookies = ctx.request.headers.get("cookie");
      const guestId = cookies?.match(/guestId=([^;]+)/)?.[1];

      if (guestId && user?._id) {
        try {
          await mergeCarts(user._id.toString(), guestId);
        } catch (error) {
          console.error("Cart merge failed during login:", error);
        }
      }

      const accessToken = signAccessToken(user);
      const { token: newRefreshToken, tokenId } = signRefreshToken(user);

      await saveRefreshToken({
        userID: user._id,
        refreshToken: newRefreshToken,
        tokenId,
      });

      await ctx.request.cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });

      await ctx.request.cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });

      await ctx.request.cookieStore.set("guestId", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return {
        success: true,
        message: "OTP verified and user authenticated successfully",
      };
    },

    googleLogin: async (
      _: any,
      { email }: { email: string; googleId: string },
      ctx: any,
    ) => {
      const { request } = ctx;

      console.log("CTX:", ctx); // debug
      const googleId = email;

      let user = await User.findOne({ googleId });

      if (!user && email) {
        user = await User.findOne({ email });
      }

      if (user && !user.googleId) {
        user.googleId = googleId;
        user.isEmailVerified = true;
        await user.save();
      }

      if (!user) {
        user = await User.create({
          email,
          googleId,
          isEmailVerified: true,
          roles: ["USER"],
        });
      }

      const cookies = request.headers.get("cookie");
      const guestId = cookies?.match(/guestId=([^;]+)/)?.[1];

      if (guestId && user?._id) {
        try {
          await mergeCarts(user._id.toString(), guestId);
        } catch (error) {
          console.error("Cart merge failed during login:", error);
        }
      }

      const accessToken = signAccessToken(user);
      const { token: refreshToken, tokenId } = signRefreshToken(user);

      await saveRefreshToken({
        userID: user._id,
        refreshToken,
        tokenId,
      });

      await ctx.request.cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });

      await ctx.request.cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });

      await ctx.request.cookieStore.set("guestId", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return {
        success: true,
        message: "Login Successful",
      };
    },
  },
};

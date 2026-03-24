import { MailService } from "./mailService";
import Redisclient from "@/lib/redis";
import argon2 from "argon2";
import { checkIsAllowed } from "@/utils/ratelimit";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const OtpService = {
  sendOtp: async (identifier: string, deviceId: string, ip: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(identifier);

    const limits = await Promise.all([
      checkIsAllowed(`ip:${ip}`, 100, 60),
      checkIsAllowed(`otp-send:${identifier}`, 3, 600),
      checkIsAllowed(`fp:${deviceId}`, 5, 600),
    ]);

    const blocked = limits.find(l => !l.allowed);
    if (blocked) {
      return {
        success: false,
        message: `Too many requests. Try again in ${blocked.retryAfter}s`,
      };
    }

    const otp = generateOtp();
    const hash = await argon2.hash(otp);

    await Redisclient.set(`auth:otp:${identifier}`, hash, { EX: 300 });

    if (isEmail) {
      await MailService.sendOtpMail(identifier, otp);
    }

    return {
      success: true,
      message: "OTP sent successfully",
    };
  },

  verifyOtp: async (identifier: string, otp: string) => {
    const hash = await Redisclient.get(`auth:otp:${identifier}`);

if (!hash || typeof hash !== "string") {
  return {
    success: false,
    message: "OTP expired or invalid",
  };
}

    const isValid = await argon2.verify(hash, otp);
    if (!isValid) {
      return {
        success: false,
        message: "Invalid OTP",
      };
    }

    await Redisclient.del(`auth:otp:${identifier}`);

    return {
      success: true,
      message: "OTP verified",
    };
  },
};
import { User } from "@/model/user.model";
import argon2 from "argon2";
import { RefreshToken } from "@/model/refreshToken.model";
import { signAccessToken, signRefreshToken } from "@/utils/token";
import { saveRefreshToken } from "@/services/saveRefreshToken";
import { serialize } from "cookie";
import { GraphQLError } from "graphql/error/GraphQLError";

interface SellerSignupInfoArgs {
  data: {
    email: string;
    password: string;
    terms: boolean;
  };
}

interface SellerLoginInfoArgs {
  data: {
    email: string;
    password: string;
    isRemember?: boolean;
  };
}

export const sellerResolver = {
  Mutation: {
    sellerSignup: async (
      _: unknown,
      { data }: SellerSignupInfoArgs,
      { user }: { user: any },
    ) => {
      const { password, terms } = data;

      if (!user) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      if (!terms) {
        return {
          success: false,
          message: "You must accept terms and condition",
        };
      }

      if (user.roles.includes("SELLER")) {
        return {
          success: false,
          message: "Seller already exist. Please login as a Seller.",
        };
      }

      if (user.passwordHash) {
        return {
          success: false,
          message: "Password already exists. Please login.",
        };
      }

      const passwordHash = await argon2.hash(password);

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordHash,
          },

          $addToSet: {
            roles: "SELLER",
          },

          $inc: { tokenVersion: 1 },
        },
      );

      return {
        success: true,
        message: "Seller acount created Successfully.",
      };
    },

    sellerLogin: async (
      _: unknown,
      { data }: SellerLoginInfoArgs,
      { user, res }: { user: any, res: any },
    ) => {
      if (!user) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      if (!user.passwordHash) {
        return {
          success: false,
          message: "Password is not set for this user",
        };
      }


      const {  password, isRemember } = data;



      const refreshMaxAge = isRemember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

      try {


        if (!user.roles.includes("SELLER")) {
          return {
            success: false,
            message:
              "This email address is not registered as a Seller. you First signup as a seller",
          };
        }

        const isValid = await argon2.verify(user.passwordHash, password);

        if (!isValid) {
          return {
            success: false,
            message: "Invalid password entered.",
          };
        }

        await RefreshToken.deleteMany({ userID: user._id });

        const accessToken = signAccessToken(user);
        const {token:refreshToken, tokenId} = signRefreshToken(user);

        await saveRefreshToken({
          userID: user._id.toString(),
          refreshToken: refreshToken,
          tokenId
        });

        res.setHeader("Set-Cookie", [
        serialize("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 15 * 60,
          path: "/",
        }),
        serialize("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        }),
      ]);

        return {
          success: true,
          message: "Welcome Back",
        };
      } catch (error) {
        console.error("SELLER LOGIN ERROR:", error);

        throw new Error("Login failed, please try again");
      }
    },
  },
};

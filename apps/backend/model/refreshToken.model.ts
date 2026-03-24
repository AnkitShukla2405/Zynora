import mongoose, {Schema, Document} from "mongoose";
import { User } from "./user.model";

const refreshTokenSchema = new Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true,
            index: true
        },

        tokenId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        tokenHash: {
            type: String,
            required: true,
        },


        expiresAt: {
            type: Date,
            required: true
        }
    },

    {timestamps: true}
)

refreshTokenSchema.index(
    {expiresAt: 1},
    { expireAfterSeconds: 0 }
)

export const RefreshToken =
  mongoose.models.RefreshToken ||
  mongoose.model("RefreshToken", refreshTokenSchema);
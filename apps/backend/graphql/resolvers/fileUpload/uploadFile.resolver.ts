
import { generateUploadPresignedUrl, generateProductUploadPresignedUrl } from "@/lib/s3/presignedUrl";
import {User} from "@/model/user.model"
import Seller from "@/model/sellerRegistration.model"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { GraphQLError } from "graphql/error/GraphQLError";

export const fileUploadResolvers = {
  Mutation: {
    getUploadUrl: (_: any,  { type, contentType, sellerId }, {user}: {user: any}) => {

      if(!user) throw new GraphQLError("User not authenticated", {
        extensions: {code: "UNAUTHENTICATED"}
      })
  return generateUploadPresignedUrl(sellerId, type, contentType);
},

productUpload: async (_:any, {productImages}, {user}: {user: any}) => {

  if(!user) throw new GraphQLError("User not authenticated", {
        extensions: {code: "UNAUTHENTICATED"}
      })
  
    if (!user || !Array.isArray(user.roles) || !user.roles.includes("SELLER")) {
    throw new GraphQLError("Only sellers can upload products", {
    extensions: { code: "FORBIDDEN" }
  });
  }
  

  if (!Array.isArray(productImages)) {
    throw new Error("No product images provided");
  }

    const sellerId = user._id.toString();

  return Promise.all(
    productImages.map(img => 
      generateProductUploadPresignedUrl(
        sellerId,
        img.productId,
        img.sku,
        img.contentType,
        img.order,
        img.clientId
      )
    )
  )
}
  },
};
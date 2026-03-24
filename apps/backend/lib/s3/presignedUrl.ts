import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3.client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export async function generateUploadPresignedUrl(
  sellerId: string,
  type: "CANCELLED_CHEQUE" | "LOGO",
  contentType: string
) {
  let key: string;

  if (type === "CANCELLED_CHEQUE") {
    key = `sellers/${sellerId}/bank/cancelled-cheque.jpg`;
  } else {
    key = `sellers/${sellerId}/branding/logo.jpg`;
  }

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60,
  });

  return { url, key };
}

export async function generateProductUploadPresignedUrl(
  sellerId: string,
  productId: string,
  sku: string,
  contentType: string,
  order: number,
  clientId: string
) {
  if (!contentType.startsWith("image/")) {
    throw new Error("Invalid content type");
  }

  const imageId = crypto.randomUUID();
  const ext = contentType.split("/")[1];

  const key = `sellers/${sellerId}/products/${productId}/variants/${sku}/${imageId}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });

  return { url, key, order, sku, clientId };
}

import jwt from "jsonwebtoken";
import { parse } from "cookie";

export const getAuthenticatedUser = (request: Request) => {
  const cookieHeader = request.headers.get("cookie") || "";
  console.log("Raw Cookie Header:", cookieHeader);

  const cookies = parse(cookieHeader);
  const token = cookies.accessToken;

  if (!token) {
    console.log("No accessToken found in cookies");
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.ZYNORA_JWT_ACCESS_SECRET!);
    return decoded;
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return null;
  }
};
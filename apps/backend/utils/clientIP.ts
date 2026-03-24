import { IncomingMessage } from "http";


export function getClientIp(request: Request, rawReq?: IncomingMessage) {

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if(realIp) return realIp;

  if(rawReq?.socket?.remoteAddress) {
    return rawReq.socket.remoteAddress;
  }


  return "127.0.0.1";
}
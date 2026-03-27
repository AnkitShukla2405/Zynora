"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/seller")) {
    return null;
  }

    if (pathname.startsWith("/auth")) {
    return null;
  }

  if (pathname.startsWith("/signup")) {
    return null;
  }

  if (pathname.startsWith("/payment/success")) {
    return null;
  }

  if (pathname.startsWith("/payment/cancel")) {
    return null;
  }
  

  return <Navbar />;
}
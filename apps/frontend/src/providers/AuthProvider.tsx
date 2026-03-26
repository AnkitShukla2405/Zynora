"use client";

import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";
import { refreshToken } from "@/apollo/client";
import Loader from "@/components/Loader";

export default function AuthProvider({ children }: any) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshToken()
      } catch (error) {
        console.log("User not authenticated");
      }finally{
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  if(loading) return <Loader />

  return <SessionProvider>{children}</SessionProvider>;
}
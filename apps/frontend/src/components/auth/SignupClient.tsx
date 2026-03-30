"use client";

import React, { useState, useRef, useEffect, use } from "react";
import {
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Loader2,
  RefreshCw,
  ShoppingBag,
  PackageCheck,
  Zap,
  Shirt,
  Armchair,
  Apple,
  User,
} from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { signupSchemaData, signupSchema } from "@/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { getFingerprint } from "@/lib/fingerprint";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { email } from "zod";

type SendOtpResponse = {
  sendOtp: {
    success: boolean;
    message: string;
  };
};

type SendOtpVariables = {
  data: {
    identifier: string;
    deviceId: string;
  };
};
type GoogleLoginResponse = {
  googleLogin: {
    success: boolean;
    message: string;
  };
};

type VerifyOtpResponse = {
  verifyOtp: {
    success: boolean;
    message: string;
  };
};

export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($email: String!) {
    googleLogin(email: $email) {
      success
      message
    }
  }
`;

export default function ZynoraEnterpriseAuth() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();

  const [googleLogin] = useMutation<GoogleLoginResponse>(GOOGLE_LOGIN, {
    onCompleted: (data) => {
      if (data.googleLogin.success) {
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get("callbackUrl");
        window.location.href = callbackUrl
          ? decodeURIComponent(callbackUrl)
          : "/";
      }
    },
  });

  useEffect(() => {
    if (session?.user?.email) {
      googleLogin({
        variables: {
          email: session.user.email,
        },
      });
    }
  }, [session]);

  const [canResend, setCanResend] = useState(false);
  const [identifierValue, setIdentifierValue] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [identifierType, setIdenifierType] = useState<"email" | "mobile">(
    "email",
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Category Rotation Logic
  const [activeCategory, setActiveCategory] = useState(0);
  const categories = [
    { name: "Fashion", icon: Shirt, color: "text-rose-600", bg: "bg-rose-50" },
    {
      name: "Electronics",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      name: "Groceries",
      icon: Apple,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      name: "Lifestyle",
      icon: Armchair,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [categories.length]);

  // --- Get device Id ---

  useEffect(() => {
    const loadFingerPrint = async () => {
      const result = await getFingerprint();
      setDeviceId(result);
    };

    loadFingerPrint();
  }, []);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
    trigger,
  } = useForm<signupSchemaData>({
    resolver: zodResolver(signupSchema),
  });

  // ---Send Otp Mutation---

  const SEND_OTP = gql`
    mutation SendOtp($data: SendOtpInput!) {
      sendOtp(data: $data) {
        success
        message
      }
    }
  `;

  // ---Verify OTP Mutation---

  const VERIFY_OTP = gql`
    mutation VerifyOtp($data: VerifyInput!) {
      verifyOtp(data: $data) {
        success
        message
      }
    }
  `;

  const [sendOtpMutation] = useMutation<SendOtpResponse, SendOtpVariables>(SEND_OTP);
  const [verifyOtpMutation] = useMutation<VerifyOtpResponse>(VERIFY_OTP, {
    onCompleted: (data) => {
      if (data.verifyOtp.success) {
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get("callbackUrl");
        window.location.href = callbackUrl
          ? decodeURIComponent(callbackUrl)
          : "/";
      }
    },
  });

  const onContinue = async (data: signupSchemaData) => {
    if (isLoading) return; // 🛑 HARD STOP
    setIsLoading(true);

    const identifier = data.identifier.trim();

    try {
      const res = await sendOtpMutation({
        variables: { data: { identifier, deviceId } },
      });

      if (res.data?.sendOtp?.success) {
        toast.success(res.data?.sendOtp.message);
        setStep(2);
      } else {
        toast.error(res.data?.sendOtp?.message ||  "Something went wrong");
      }

      setIdentifierValue(identifier);
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- OTP Logic ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Take last char
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.every((char) => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      pastedData.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      otpInputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    setIsLoading(true);

    try {
      const res = await verifyOtpMutation({
        variables: {
          data: {
            otp: otpValue,
            identifier: identifierValue,
          },
        },
      });

      if (res.data?.verifyOtp?.success) {
        const safeRedirect = callbackUrl.startsWith("/") ? callbackUrl : "/";

        router.push(safeRedirect);
      } else {
        toast.error(res.data?.verifyOtp?.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FFF8F1] font-sans text-[#3E1F21]">
      {/* ================= LEFT PANEL: BRAND STORYTELLING ================= */}
      <div className="hidden lg:flex w-5/12 relative flex-col justify-between p-16 border-r border-[#EAC6C6]/50 overflow-hidden">
        {/* Background Texture */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#7F1113 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        {/* Brand Header */}
        <div className="relative z-10 animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 bg-[#7F1113] rounded-lg flex items-center justify-center shadow-lg shadow-[#7F1113]/20">
              <PackageCheck className="text-[#FFF8F1]" size={20} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#7F1113]">
              Zynora Ecommerce
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.15] mb-6">
            The Everything <br />
            Store for <br />
            <span className="relative inline-block mt-2">
              <span
                className={`relative z-10 px-2 transition-colors duration-500 ${categories[activeCategory].color}`}
              >
                {categories[activeCategory].name}.
              </span>
              {/* Underline decoration */}
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#EAC6C6]/30 -rotate-1 rounded-full z-0"></span>
            </span>
          </h1>
          <p className="text-lg text-[#8C5E5E] max-w-sm leading-relaxed">
            Join millions of shoppers discovering premium quality across
            fashion, tech, and home essentials.
          </p>
        </div>

        {/* Dynamic Showcase Card */}
        <div className="relative z-10 w-full max-w-xs mt-auto">
          <div className="bg-white/60 backdrop-blur-md border border-[#EAC6C6] p-5 rounded-2xl shadow-xl shadow-[#7F1113]/5 transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-3">
              <div
                className={`p-3 rounded-full transition-colors duration-500 ${categories[activeCategory].bg} ${categories[activeCategory].color}`}
              >
                {React.createElement(categories[activeCategory].icon, {
                  size: 24,
                })}
              </div>
              <div>
                <p className="text-xs font-bold text-[#8C5E5E] uppercase tracking-wider">
                  Trending Now
                </p>
                <p className="font-bold text-[#3E1F21]">
                  Winter Collection '25
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-medium text-[#8C5E5E] border-t border-[#EAC6C6]/30 pt-3">
              <span>4.9/5 Rating</span>
              <span>1M+ Products</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#8C5E5E]/70 mt-8 font-medium">
          © 2025 Zynora Ecommerce Retail Pvt Ltd.
        </div>
      </div>

      {/* ================= RIGHT PANEL: AUTH FORM ================= */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[460px]">
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                step === 1 ? "bg-[#7F1113]" : "bg-[#7F1113]/20"
              }`}
            ></div>
            <div
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                step === 2 ? "bg-[#7F1113]" : "bg-[#EAC6C6]/30"
              }`}
            ></div>
          </div>

          <div className="bg-white border border-[#EAC6C6] shadow-[0_20px_50px_-12px_rgba(127,17,19,0.1)] rounded-3xl p-8 lg:p-10 relative overflow-hidden">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#3E1F21] mb-2">
                {step === 1 ? "Get started" : "Confirm it's you"}
              </h2>
              <p className="text-[#8C5E5E]">
                {step === 1 ? (
                  "Enter your details to access your account."
                ) : (
                  <span className="flex items-center gap-1">
                    Code sent to{" "}
                    <span className="font-semibold text-[#3E1F21]">
                      {identifierValue}
                    </span>
                  </span>
                )}
              </p>
            </div>

            {/* STEP 1: INPUT FORM */}
            {step === 1 && (
              <form
                onSubmit={handleSubmit(onContinue)}
                className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="identifier"
                    className="block text-sm font-bold text-[#3E1F21]"
                  >
                    Email or Mobile Number
                  </label>
                  <div className="relative group transition-all duration-300">
                    {/* Dynamic Icon */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C5E5E] transition-colors group-focus-within:text-[#7F1113]">
                      <User size={20} />
                    </div>

                    <input
                      id="identifier"
                      type="text"
                      {...register("identifier", {
                        required: "This field is required",
                      })}
                      placeholder="john@example.com or 9876543210"
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#FFF8F1] border rounded-xl text-[#3E1F21] placeholder:text-[#8C5E5E]/60 outline-none transition-all duration-200
                          ${
                            errors.identifier
                              ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-[#EAC6C6] focus:border-[#7F1113] focus:ring-4 focus:ring-[#7F1113]/5 hover:border-[#7F1113]/50"
                          }
                        `}
                    />
                  </div>
                  {errors.identifier && (
                    <p
                      role="alert"
                      className="text-sm text-red-600 font-medium animate-in slide-in-from-top-1"
                    >
                      {errors.identifier.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#7F1113] text-[#FFF8F1] rounded-xl font-bold text-lg hover:bg-[#680e0f] disabled:opacity-80 disabled:cursor-not-allowed active:scale-[0.99] transition-all shadow-xl shadow-[#7F1113]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      Continue <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#EAC6C6]/60" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-[#8C5E5E] font-semibold tracking-wider">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => signIn("google")}
                      className="flex items-center justify-center p-2.5 border border-[#EAC6C6] rounded-xl 
             hover:bg-[#FFF8F1] hover:border-[#7F1113]/30 transition-all gap-2 
             text-sm font-semibold text-[#3E1F21]"
                    >
                      <Image
                        src="/google.png"
                        alt="apple login"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      Google
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: OTP FORM */}
            {step === 2 && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                <div
                  className="flex justify-center gap-2 sm:gap-3 mb-8 w-full"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {(otpInputRefs.current[idx] = el)}}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className={`
              /* 2. Responsive sizing for touch targets */
              w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-16 
              /* 3. Responsive text sizing */
              text-xl sm:text-2xl 
              text-center font-bold rounded-xl border outline-none transition-all duration-200
              ${
                digit
                  ? "border-[#7F1113] bg-[#FFF8F1] text-[#7F1113] shadow-lg shadow-[#7F1113]/10 scale-105"
                  : "border-[#EAC6C6] bg-white text-[#3E1F21] focus:border-[#7F1113] focus:ring-4 focus:ring-[#7F1113]/10"
              }
            `}
                    />
                  ))}
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={otp.some((d) => !d) || isLoading}
                  className="w-full py-3 sm:py-4 bg-[#7F1113] text-[#FFF8F1] rounded-xl font-bold text-base sm:text-lg hover:bg-[#680e0f] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 mb-5 sm:mb-6"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    "Verify & Login"
                  )}
                </button>

                <div className="flex flex-col min-[380px]:flex-row items-center justify-between text-xs sm:text-sm px-2 gap-4 min-[380px]:gap-0">
                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    className="text-[#8C5E5E] hover:text-[#3E1F21] font-medium transition-colors"
                  >
                    Change {identifierType}
                  </button>

                  <button
                    disabled={timer > 0}
                    onClick={() => setTimer(30)}
                    className={`font-semibold flex items-center gap-1.5 ${
                      timer > 0
                        ? "text-[#EAC6C6] cursor-not-allowed"
                        : "text-[#7F1113] hover:underline"
                    }`}
                  >
                    {timer > 0 ? (
                      <>
                        <RefreshCw
                          size={14}
                          className="animate-spin duration-[3000ms]"
                        />{" "}
                        Resend in {timer}s
                      </>
                    ) : (
                      "Resend Code"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Footer Policy */}
            <div className="mt-8 pt-6 border-t border-[#EAC6C6]/40 text-center">
              <p className="text-xs text-[#8C5E5E]">
                By continuing, you agree to Zynora Ecommerce's{" "}
                <a
                  href="#"
                  className="underline decoration-[#7F1113]/30 hover:text-[#7F1113]"
                >
                  Terms of Use
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="underline decoration-[#7F1113]/30 hover:text-[#7F1113]"
                >
                  Privacy Policy
                </a>
                .
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-[#8C5E5E]/80 uppercase tracking-widest font-semibold">
                <ShieldCheck size={12} /> 256-Bit Secure SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

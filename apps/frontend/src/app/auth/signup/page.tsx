"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthLayout } from "@/components/AuthLayout";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Mail, Lock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type GetSellerAuthForEmailResponse = {
  getSellerAuthForEmail: {
    email: string;
  } | null;
};

type SellerSignupResponse = {
  sellerSignup: {
    success: boolean;
    message: string;
  };
};

type SellerSignupVariables = {
  data: {
    email: string;
    password: string;
    terms: boolean;
  };
};

const GET_SELLER_AUTH_FOR_EMAIL = gql`
  query GetSellerAuthForEmail {
    getSellerAuthForEmail {
      email
    }
  }
`;

const signupSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid work email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    mode: "onChange",
  });

  const password = watch("password");

  const { data, loading, error } = useQuery<GetSellerAuthForEmailResponse>(GET_SELLER_AUTH_FOR_EMAIL, {
    fetchPolicy: "cache-and-network",
  });

  React.useEffect(() => {
  if (data?.getSellerAuthForEmail?.email) {
    setValue("email", data.getSellerAuthForEmail.email);
  }
}, [data, setValue]);

  // Mutation call

  const Seller_Signup = gql`
    mutation SellerSignup($data: SellerSignUpInput!) {
      sellerSignup(data: $data) {
        success
        message
      }
    }
  `;

  const [SellerSignup] = useMutation<SellerSignupResponse, SellerSignupVariables>(Seller_Signup);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);

    const { email, password, terms } = data;

    const res = await SellerSignup({
      variables: {
        data: {
          email,
          password,
          terms,
        },
      },
    });

    if (res.data?.sellerSignup.success) {
      setIsLoading(false);
      toast.success(res.data.sellerSignup.message)
      router.push("/seller/auth/signin");
    }else {
      setIsLoading(false)
        toast.error(res.data?.sellerSignup?.message || "Something went wrong")
    }
  };

  // Password strength indicators
  const strengthChecks = [
    { label: "At least 8 characters", valid: password?.length >= 8 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(password || "") },
    { label: "Number", valid: /[0-9]/.test(password || "") },
    { label: "Special character", valid: /[^A-Za-z0-9]/.test(password || "") },
  ];

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start selling on our enterprise platform"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            label="Work Email"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email}
            {...register("email")}
          />

          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            label="Password"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password}
            {...register("password")}
          />

          {/* Password Strength Meter */}
          {password && (
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              {strengthChecks.map((check, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-xs"
                >
                  {check.valid ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-slate-300 bg-white" />
                  )}
                  <span
                    className={cn(
                      "text-slate-500",
                      check.valid && "text-green-700 font-medium",
                    )}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            label="Confirm Password"
            icon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              label={
                <span className="text-slate-600">
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              }
              error={errors.terms}
              {...register("terms")}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full border-2 border-slate-700 text-black"
          isLoading={isLoading}
          disabled={!isValid || isLoading}
        >
          Create Seller Account
        </Button>

        <div className="text-center text-sm text-slate-900">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-primary hover:text-primary/80 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

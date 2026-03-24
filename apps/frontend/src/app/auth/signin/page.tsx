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
import { Mail, Lock } from "lucide-react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type GetSellerAuthForEmailResponse = {
  getSellerAuthForEmail: {
    email: string;
  } | null;
};

type SellerLoginResponse = {
  sellerLogin: {
    success: boolean;
    message: string;
  };
};

const GET_SELLER_AUTH_FOR_EMAIL = gql`
  query GetSellerAuthForEmail {
    getSellerAuthForEmail {
      email
    }
  }
`;

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { data, loading, error } = useQuery<GetSellerAuthForEmailResponse>(GET_SELLER_AUTH_FOR_EMAIL, {
    fetchPolicy: "cache-and-network",
  });

  React.useEffect(() => {
    if (data?.getSellerAuthForEmail?.email) {
      setValue("email", data.getSellerAuthForEmail.email);
    }
  }, [data, setValue]);

  // Mutation

  const SELLER_LOGIN = gql`
    mutation SellerLogin($data: SellerLoginInput!) {
      sellerLogin(data: $data) {
        success
        message
      }
    }
  `;

  const [SellerLogin] = useMutation<SellerLoginResponse>(SELLER_LOGIN);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const res = await SellerLogin({
        variables: {
          data: {
            email: data.email,
            password: data.password,
            isRemember: data.rememberMe,
          },
        },
      });

      const result = res.data?.sellerLogin;

      if (result?.success) {
        toast.success(result?.message)
        router.push("/sellerRegistration")
      } else {
        toast.error(result?.message || "Login Failed")
      }
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your seller dashboard"
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password}
                {...register("password")}
              />
            </div>
            <div className="flex justify-end">
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:text-primary/80 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              label="Remember me for 30 days"
              {...register("rememberMe")}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full text-black"
          isLoading={isLoading}
        >
          Sign in
        </Button>

        <div className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:text-primary/80 hover:underline"
          >
            Create Seller Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

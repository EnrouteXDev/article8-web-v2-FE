"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/lib/queries/auth";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/schemas";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword(values, {
      onSuccess: () => setSubmitted(true),
      onError: (error) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message =
          (error as any)?.response?.data?.message ?? "Something went wrong. Please try again.";
        setError("root", { message });
      },
    });
  };

  if (submitted) {
    return (
      <div className="w-full max-w-90 flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="size-6 text-green-500" />
        </div>
        <div>
          <p
            className="text-base font-semibold text-gray-900"
            style={{ fontFamily: "var(--font-satoshi)" }}
          >
            Check your email
          </p>
          <p
            className="text-sm text-gray-500 mt-1"
            style={{ fontFamily: "var(--font-satoshi)" }}
          >
            A password reset link has been sent to your email address. The link
            expires in 1 hour.
          </p>
        </div>
        <Link
          href="/admin/login"
          className="text-sm text-primary hover:underline mt-2"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-90 flex flex-col gap-4"
    >
      <div className="mb-2">
        <p
          className="text-sm text-gray-500"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm text-gray-700"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Email address"
          disabled={isPending}
          className="h-11 rounded-lg border-gray-200 text-sm text-gray-800"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {errors.root && (
        <p
          className="text-sm text-red-500"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-lg text-sm bg-primary hover:bg-primary/90 text-white mt-1 flex items-center justify-center gap-2"
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        {isPending ? (
          <>
            <Spinner className="size-4" />
            Sending link...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <Link
        href="/admin/login"
        className="text-sm text-gray-500 hover:text-gray-700 text-center"
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        Back to login
      </Link>
    </form>
  );
}

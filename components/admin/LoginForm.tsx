"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginAdmin } from "@/lib/queries/auth";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLoginAdmin();

  const onSubmit = (values: LoginFormValues) => {
    login(values, {
      onError: (error) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message =
          (error as any)?.response?.data?.message ??
          "Login failed. Please try again.";
        setError("root", { message });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-90 flex flex-col gap-4"
    >
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

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm text-gray-700"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          disabled={isPending}
          className="h-11 rounded-lg border-gray-200 text-sm text-gray-800"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
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

      <Link
        href="/admin/forgot-password"
        className="text-sm text-primary hover:underline w-fit"
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        Forgot password?
      </Link>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-lg text-sm bg-primary hover:bg-primary/90 text-white mt-1 flex items-center justify-center gap-2"
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        {isPending ? (
          <>
            <Spinner className="size-4" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}

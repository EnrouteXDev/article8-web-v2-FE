"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useResetPassword } from "@/lib/queries/auth";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/schemas";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: resetPassword, isPending } = useResetPassword();

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!email) {
      setError("root", { message: "Invalid reset link. Please request a new one." });
      return;
    }

    resetPassword(
      { email, newPassword: values.newPassword, confirmPassword: values.confirmPassword },
      {
        onError: (error) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const message =
            (error as any)?.response?.data?.message ?? "Something went wrong. Please try again.";
          setError("root", { message });
        },
      }
    );
  };

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
          Enter and confirm your new password below.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="newPassword"
          className="text-sm text-gray-700"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          New password
        </label>
        <Input
          id="newPassword"
          type="password"
          placeholder="New password"
          disabled={isPending}
          className="h-11 rounded-lg border-gray-200 text-sm text-gray-800"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-sm text-gray-700"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          Confirm new password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          disabled={isPending}
          className="h-11 rounded-lg border-gray-200 text-sm text-gray-800"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
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
            Resetting password...
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
}

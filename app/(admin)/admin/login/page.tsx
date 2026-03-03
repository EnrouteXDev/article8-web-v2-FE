import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left — image panel */}
      <div className="relative hidden md:block w-1/2 shrink-0">
        <span
          className="absolute top-6 left-8 z-10 text-white text-sm font-light tracking-widest"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          login
        </span>
        <Image
          src="/heroBg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right — form panel */}
      <div className="flex-1 bg-white flex flex-col min-w-0">
        {/* Top-right avatar placeholder */}
        <div className="flex justify-end p-5">
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
            <span
              className="text-xs text-gray-500 select-none"
              style={{ fontFamily: "var(--font-satoshi)" }}
            >
              U
            </span>
          </div>
        </div>

        {/* Centred content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Logo */}
          <Image
            src="/Logo.svg"
            alt="Article8 Media Studios"
            width={185}
            height={54}
            className="mb-12"
          />

          {/* Fields */}
          <div className="w-full max-w-90 flex flex-col gap-4">
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
                className="h-11 rounded-lg border-gray-200 text-sm"
              />
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
                className="h-11 rounded-lg border-gray-200 text-sm"
              />
            </div>

            <Link
              href="/admin/forgot-password"
              className="text-sm text-primary hover:underline w-fit"
              style={{ fontFamily: "var(--font-satoshi)" }}
            >
              Forgot password?
            </Link>

            <Button
              className="w-full h-11 rounded-lg text-sm bg-primary hover:bg-primary/90 text-white mt-1"
              style={{ fontFamily: "var(--font-satoshi)" }}
            >
              Login
            </Button>
          </div>
        </div>

        {/* Bottom spacer to balance the top bar */}
        <div className="h-14" />
      </div>
    </div>
  );
}

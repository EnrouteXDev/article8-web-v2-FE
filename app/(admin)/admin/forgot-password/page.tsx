import Image from "next/image";
import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left — image panel */}
      <div className="relative hidden md:block w-1/2 shrink-0">
        <span
          className="absolute top-6 left-8 z-10 text-white text-sm font-light tracking-widest"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          forgot password
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

        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <Image
            src="/Logo.svg"
            alt="Article8 Media Studios"
            width={185}
            height={54}
            className="mb-8"
          />
          <h1
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "var(--font-satoshi)" }}
          >
            Forgot your password?
          </h1>
          <div className="mb-6" />
          <ForgotPasswordForm />
        </div>

        <div className="h-14" />
      </div>
    </div>
  );
}

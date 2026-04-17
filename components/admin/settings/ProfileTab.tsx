"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth";

export default function ProfileTab() {
  const admin = useAuthStore((s) => s.admin);

  const [firstname, setFirstname] = useState(admin?.firstname ?? "");
  const [lastname, setLastname] = useState(admin?.lastname ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [phone, setPhone] = useState("");

  const initials = `${admin?.firstname?.[0] ?? ""}${admin?.lastname?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-[#202227]">Personal Information</h2>
        <p className="mt-0.5 text-xs text-primary">Update your Personal Profile Information</p>
      </div>

      {/* Avatar */}
      <div className="relative w-fit">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
          {initials || "A"}
        </div>
        <button className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-gray-800 text-white hover:bg-gray-700 transition-colors">
          <Camera className="size-3" />
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4 max-w-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-[#344054]">First name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="h-10 rounded-lg border border-[#D0D5DD] px-3 text-sm text-[#344054] outline-none focus:border-[#B3B8C5] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-[#344054]">Last name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="h-10 rounded-lg border border-[#D0D5DD] px-3 text-sm text-[#344054] outline-none focus:border-[#B3B8C5] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#344054]">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-lg border border-[#D0D5DD] px-3 text-sm text-[#344054] outline-none focus:border-[#B3B8C5] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#344054]">Phone number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234"
            className="h-10 rounded-lg border border-[#D0D5DD] px-3 text-sm text-[#344054] outline-none focus:border-[#B3B8C5] transition-colors placeholder:text-[#98A2B3]"
          />
        </div>

        <button
          onClick={() => toast.info("Profile update coming soon")}
          className="mt-2 w-fit rounded-lg bg-[#09062A] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#151043]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

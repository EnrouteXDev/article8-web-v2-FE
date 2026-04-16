"use client";

import { useState } from "react";
import { ArrowLeft, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { useInviteAdmin } from "@/lib/queries/auth";
import { AdminRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLES: { value: AdminRole; label: string; description: string }[] = [
  {
    value: AdminRole.SUPER_ADMIN,
    label: "Super Admin",
    description: "Can search orders, manage returns/refunds, add notes",
  },
  {
    value: AdminRole.SITE_ADMIN,
    label: "Site Admin",
    description: "Can manage products, policies, orders, exports",
  },
  {
    value: AdminRole.CUSTOMER_SUPPORT,
    label: "Customer Support Rep",
    description: "Can search orders, manage returns/refunds, add notes",
  },
  {
    value: AdminRole.MEMBER,
    label: "Member",
    description: "Can search orders, manage returns/refunds, add notes",
  },
];

export default function InviteMemberView({ onBack }: { onBack: () => void }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);

  const { mutate: invite, isPending } = useInviteAdmin();

  const selectedRole = ROLES.find((r) => r.value === role);

  const handleSubmit = () => {
    if (!firstname || !lastname || !email || !role) {
      toast.error("Please fill in all fields");
      return;
    }
    invite(
      { firstname, lastname, email, role },
      {
        onSuccess: () => {
          toast.success("Invitation sent successfully");
          onBack();
        },
        onError: () => toast.error("Failed to send invitation"),
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#344054] transition-colors mb-2"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>
          <h2 className="text-base font-semibold text-[#202227]">Enter Information</h2>
          <p className="text-xs text-[#707580]">Enter the basic details of who you would like to invite</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="shrink-0 rounded-lg bg-[#09062A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#151043] disabled:opacity-60"
        >
          {isPending ? "Sending…" : "Save Changes"}
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

        {/* Role select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#344054]">Select role</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleOpen((o) => !o)}
              className="flex h-10 w-full items-center justify-between rounded-lg border border-[#D0D5DD] px-3 text-sm text-[#344054] outline-none transition-colors hover:border-[#B3B8C5]"
            >
              <span className={selectedRole ? "text-[#344054]" : "text-[#98A2B3]"}>
                {selectedRole?.label ?? "Select role"}
              </span>
              <ChevronDown className={cn("size-4 text-[#98A2B3] transition-transform", roleOpen && "rotate-180")} />
            </button>

            {roleOpen && (
              <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-[0_12px_24px_rgba(16,24,40,0.12)]">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => { setRole(r.value); setRoleOpen(false); }}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#344054]">{r.label}</p>
                      <p className="text-xs text-[#667085]">{r.description}</p>
                    </div>
                    {role === r.value && <Check className="size-4 text-primary mt-0.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminRole, AdminPermission } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth";
import InviteMemberView from "./InviteMemberView";

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

const ROLE_LABELS: Record<AdminRole, string> = {
  [AdminRole.SUPER_ADMIN]: "Super Admin",
  [AdminRole.SITE_ADMIN]: "Site Admin",
  [AdminRole.CUSTOMER_SUPPORT]: "Customer support rep",
  [AdminRole.MEMBER]: "Member",
};

// Mock users — replace with real GET /admin endpoint when available
const MOCK_USERS = [
  { id: "1", name: "Aliyu Maryam", email: "aliyumudahiru@gmail.com", lastActive: "2 hours ago", role: AdminRole.SITE_ADMIN },
  { id: "2", name: "Aliyu Maryam", email: "aliyumudahiru@gmail.com", lastActive: "2 hours ago", role: AdminRole.CUSTOMER_SUPPORT },
  { id: "3", name: "Aliyu Maryam", email: "aliyumudahiru@gmail.com", lastActive: "2 hours ago", role: AdminRole.CUSTOMER_SUPPORT },
  { id: "4", name: "Aliyu Maryam", email: "aliyumudahiru@gmail.com", lastActive: "2 hours ago", role: AdminRole.CUSTOMER_SUPPORT },
];

function UserInitials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials = parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F4C7B8] text-xs font-bold text-[#7A3A28]">
      {initials}
    </div>
  );
}

function RoleDropdown({
  currentRole,
  onChange,
}: {
  currentRole: AdminRole;
  onChange: (role: AdminRole) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="flex items-center gap-1.5 text-sm text-[#344054] hover:text-[#101828] transition-colors"
      >
        {ROLE_LABELS[currentRole]}
        <ChevronDown className={cn("size-4 text-[#98A2B3] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-64 rounded-xl border border-gray-200 bg-white py-1 shadow-[0_12px_24px_rgba(16,24,40,0.12)]">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => { onChange(r.value); setOpen(false); }}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#344054]">{r.label}</p>
                  <p className="text-xs text-[#667085]">{r.description}</p>
                </div>
                {currentRole === r.value && <Check className="size-4 text-primary mt-0.5 shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function UsersTab() {
  const [inviting, setInviting] = useState(false);
  const [users, setUsers] = useState(MOCK_USERS);
  const admin = useAuthStore((s) => s.admin);

  const canInvite =
    admin?.permissions?.includes(AdminPermission.ALL) ||
    admin?.permissions?.includes(AdminPermission.INVITE);

  if (inviting) {
    return <InviteMemberView onBack={() => setInviting(false)} />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#202227]">Manage user roles</h2>
          <p className="mt-0.5 text-xs text-[#707580]">Handle permissions and user roles</p>
        </div>
        {canInvite && (
          <button
            onClick={() => setInviting(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#09062A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#151043]"
          >
            <Plus className="size-4" />
            Invite Members
          </button>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#F2F4F7] text-[10px] uppercase tracking-[0.05em] text-[#667085]">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Last Active</th>
              <th className="pb-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#F2F4F7]">
                <td className="py-4">
                  <div className="flex items-center gap-2.5">
                    <UserInitials name={user.name} />
                    <span className="text-sm font-medium text-[#344054]">{user.name}</span>
                  </div>
                </td>
                <td className="py-4 text-sm text-[#667085]">{user.email}</td>
                <td className="py-4 text-sm text-[#667085]">{user.lastActive}</td>
                <td className="py-4">
                  <RoleDropdown
                    currentRole={user.role}
                    onChange={(role) =>
                      setUsers((prev) =>
                        prev.map((u) => (u.id === user.id ? { ...u, role } : u))
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <div key={user.id} className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <UserInitials name={user.name} />
                <div>
                  <p className="text-sm font-medium text-[#344054]">{user.name}</p>
                  <p className="text-xs text-[#667085]">{user.email}</p>
                </div>
              </div>
              <RoleDropdown
                currentRole={user.role}
                onChange={(role) =>
                  setUsers((prev) =>
                    prev.map((u) => (u.id === user.id ? { ...u, role } : u))
                  )
                }
              />
            </div>
            <p className="mt-2 text-xs text-[#98A2B3]">Last active: {user.lastActive}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

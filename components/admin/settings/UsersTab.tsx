"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminRole, AdminPermission } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth";
import { useAdminUsers, useUpdateAdminRole } from "@/lib/queries/auth";
import { toast } from "sonner";
import InviteMemberView from "./InviteMemberView";

const ROLES: { value: AdminRole; label: string; description: string }[] = [
  { value: AdminRole.SUPER_ADMIN, label: "Super Admin", description: "Can search orders, manage returns/refunds, add notes" },
  { value: AdminRole.SITE_ADMIN, label: "Site Admin", description: "Can manage products, policies, orders, exports" },
  { value: AdminRole.CUSTOMER_SUPPORT, label: "Customer Support Rep", description: "Can search orders, manage returns/refunds, add notes" },
  { value: AdminRole.MEMBER, label: "Member", description: "Can search orders, manage returns/refunds, add notes" },
];

const ROLE_LABELS: Record<AdminRole, string> = {
  [AdminRole.SUPER_ADMIN]: "Super Admin",
  [AdminRole.SITE_ADMIN]: "Site Admin",
  [AdminRole.CUSTOMER_SUPPORT]: "Customer support rep",
  [AdminRole.MEMBER]: "Member",
};

function formatLastActive(lastActive: string | null) {
  if (!lastActive) return "Never";
  const diff = Date.now() - new Date(lastActive).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function UserInitials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials = parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F4C7B8] text-xs font-bold text-[#7A3A28]">
      {initials}
    </div>
  );
}

function RowSkeleton() {
  return (
    <tr className="border-b border-[#F2F4F7]">
      {Array.from({ length: 4 }).map((_, i) => (
        <td key={i} className="py-4 px-1">
          <div className="h-4 rounded bg-gray-100 animate-pulse w-24" />
        </td>
      ))}
    </tr>
  );
}

function RoleDropdown({ userId, currentRole, canEdit }: { userId: string; currentRole: AdminRole; canEdit: boolean }) {
  const [open, setOpen] = useState(false);
  const { mutate: updateRole, isPending } = useUpdateAdminRole();

  if (!canEdit) {
    return <span className="text-sm text-[#344054]">{ROLE_LABELS[currentRole]}</span>;
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled={isPending}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="flex items-center gap-1.5 text-sm text-[#344054] hover:text-[#101828] transition-colors disabled:opacity-50"
      >
        {isPending ? "Updating…" : ROLE_LABELS[currentRole]}
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
                onClick={() => {
                  setOpen(false);
                  updateRole(
                    { id: userId, data: { role: r.value } },
                    {
                      onSuccess: () => toast.success("Role updated"),
                      onError: () => toast.error("Failed to update role"),
                    }
                  );
                }}
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
  const admin = useAuthStore((s) => s.admin);
  const { data, isLoading } = useAdminUsers();

  const users = data?.data ?? [];

  const canInvite =
    admin?.permissions?.includes(AdminPermission.ALL) ||
    admin?.permissions?.includes(AdminPermission.INVITE);

  const canEditRoles = admin?.permissions?.includes(AdminPermission.ALL);

  if (inviting) {
    return <InviteMemberView onBack={() => setInviting(false)} />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#202227]">Manage user roles</h2>
          <p className="mt-0.5 text-xs text-[#707580]">
            Handle permissions and user roles
            {!isLoading && ` · ${users.length} member${users.length !== 1 ? "s" : ""}`}
          </p>
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
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
              : users.map((user) => (
                  <tr key={user.id} className="border-b border-[#F2F4F7]">
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <UserInitials name={user.name} />
                        <span className="text-sm font-medium text-[#344054]">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-[#667085]">{user.email}</td>
                    <td className="py-4 text-sm text-[#667085]">{formatLastActive(user.lastActive)}</td>
                    <td className="py-4">
                      <RoleDropdown userId={user.id} currentRole={user.role} canEdit={!!canEditRoles} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-gray-100" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3 w-28 bg-gray-100 rounded" />
                    <div className="h-3 w-40 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))
          : users.map((user) => (
              <div key={user.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <UserInitials name={user.name} />
                    <div>
                      <p className="text-sm font-medium text-[#344054]">{user.name}</p>
                      <p className="text-xs text-[#667085]">{user.email}</p>
                    </div>
                  </div>
                  <RoleDropdown userId={user.id} currentRole={user.role} canEdit={!!canEditRoles} />
                </div>
                <p className="mt-2 text-xs text-[#98A2B3]">Last active: {formatLastActive(user.lastActive)}</p>
              </div>
            ))}
      </div>

      {!isLoading && users.length === 0 && (
        <p className="py-10 text-center text-sm text-[#667085]">No team members yet.</p>
      )}
    </div>
  );
}

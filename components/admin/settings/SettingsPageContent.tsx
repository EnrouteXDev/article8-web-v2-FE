"use client";

import { useState } from "react";
import AdminPage from "@/components/admin/shared/AdminPage";
import ProfileTab from "./ProfileTab";
import UsersTab from "./UsersTab";

type Tab = "profile" | "users";

const TABS: { key: Tab; label: string }[] = [
  { key: "profile", label: "Profile Information" },
  { key: "users", label: "Users" },
];

export default function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <AdminPage className="flex flex-col gap-6" style={{ fontFamily: "var(--font-satoshi)" }}>
      <div className="rounded-xl bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
        {/* Tabs */}
        <div className="flex border-b border-[#F2F4F7] px-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative py-4 px-1 mr-8 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-[#202227]"
                  : "text-[#98A2B3] hover:text-[#667085]"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "users" && <UsersTab />}
        </div>
      </div>
    </AdminPage>
  );
}

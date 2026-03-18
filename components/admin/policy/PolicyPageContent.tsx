"use client";

import { useState } from "react";
import {
  ChevronDown,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  Link,
  Image,
  List,
  ListOrdered,
} from "lucide-react";
import AdminPage from "@/components/admin/shared/AdminPage";

function RichTextEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50 flex-wrap">
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors font-medium"
          >
            Normal text
            <ChevronDown className="size-3.5 text-gray-500" />
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {[
            { icon: Bold, label: "Bold" },
            { icon: Italic, label: "Italic" },
            { icon: Heading1, label: "H1" },
            { icon: Heading2, label: "H2" },
            { icon: Quote, label: "Quote" },
          ].map(({ icon: Icon, label: buttonLabel }) => (
            <button
              key={buttonLabel}
              type="button"
              title={buttonLabel}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              <Icon className="size-4" />
            </button>
          ))}

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {[
            { icon: Link, label: "Link" },
            { icon: Image, label: "Image" },
          ].map(({ icon: Icon, label: buttonLabel }) => (
            <button
              key={buttonLabel}
              type="button"
              title={buttonLabel}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              <Icon className="size-4" />
            </button>
          ))}

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {[
            { icon: List, label: "Bullet list" },
            { icon: ListOrdered, label: "Ordered list" },
          ].map(({ icon: Icon, label: buttonLabel }) => (
            <button
              key={buttonLabel}
              type="button"
              title={buttonLabel}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={8}
          placeholder="Write your policy here..."
          className="w-full px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none resize-none"
        />
      </div>
    </div>
  );
}

export default function PolicyPageContent() {
  const [shippingPolicy, setShippingPolicy] = useState(
    "Orders are processed within 1-3 business days. Delivery typically takes 5-10 business days depending on your location. We ship internationally to select countries."
  );
  const [returnPolicy, setReturnPolicy] = useState(
    "Items may be returned within the specified return window provided they are unused, in original packaging, and accompanied by proof of purchase."
  );
  const [returnWindow, setReturnWindow] = useState("7 days");
  const [returnRule, setReturnRule] = useState<"customer" | "free">(
    "customer"
  );

  return (
    <AdminPage className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Rules &amp; Policy</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your store policies and return rules
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
          Save changes
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 flex flex-col gap-6">
        <RichTextEditor
          label="Shipping policy"
          value={shippingPolicy}
          onChange={setShippingPolicy}
        />
        <RichTextEditor
          label="Return policy"
          value={returnPolicy}
          onChange={setReturnPolicy}
        />
      </div>

      <div className="bg-white rounded-xl p-6 flex flex-col gap-5">
        <p className="text-base font-bold text-gray-900">Return Settings</p>

        <div className="flex flex-col gap-1.5 max-w-xs">
          <label className="text-sm font-medium text-gray-700">
            Return window
          </label>
          <input
            type="text"
            value={returnWindow}
            onChange={(event) => setReturnWindow(event.target.value)}
            placeholder="e.g 7 days"
            className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-700">Return rules</p>
          {[
            {
              value: "customer" as const,
              label: "Customer provides return shipping",
            },
            {
              value: "free" as const,
              label: "Free return shipping",
            },
          ].map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                onClick={() => setReturnRule(value)}
                className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  returnRule === value
                    ? "border-gray-900 bg-gray-900"
                    : "border-gray-300 bg-white group-hover:border-gray-400"
                }`}
              >
                {returnRule === value && (
                  <div className="size-2 rounded-full bg-white" />
                )}
              </div>
              <span
                onClick={() => setReturnRule(value)}
                className="text-sm text-gray-700 select-none"
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}

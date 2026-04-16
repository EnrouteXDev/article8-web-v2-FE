"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import AdminPage from "@/components/admin/shared/AdminPage";
import { Spinner } from "@/components/ui/spinner";
import { usePolicy, useUpsertPolicy } from "@/lib/queries/policy";
import { ReturnRule } from "@/lib/types";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

function RichTextEditor({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className={`rounded-xl border border-gray-200 overflow-hidden ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={quillModules}
          placeholder="Write your policy here..."
        />
      </div>
    </div>
  );
}

function PolicySkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="bg-white rounded-xl p-6 flex flex-col gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-48 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 flex flex-col gap-5">
        <div className="h-5 w-36 bg-gray-200 rounded" />
        <div className="h-11 w-64 bg-gray-100 rounded-lg" />
        <div className="flex flex-col gap-3">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-5 w-56 bg-gray-100 rounded" />
          <div className="h-5 w-44 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function PolicyPageContent() {
  const { data, isLoading, isError } = usePolicy();
  const { mutate: upsertPolicy, isPending } = useUpsertPolicy();

  const [shippingPolicy, setShippingPolicy] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [returnWindow, setReturnWindow] = useState("");
  const [returnRules, setReturnRules] = useState<ReturnRule>(ReturnRule.CUSTOMER_PAYS);

  // Populate fields once data loads
  useEffect(() => {
    if (!data?.policy) return;
    const p = data.policy;
    setShippingPolicy(p.shippingPolicy);
    setReturnPolicy(p.returnPolicy);
    setReturnWindow(String(p.returnWindow));
    setReturnRules(p.returnRules);
  }, [data]);

  const handleSave = () => {
    const window = parseInt(returnWindow, 10);
    if (!shippingPolicy.trim()) return toast.error("Shipping policy is required");
    if (!returnPolicy.trim()) return toast.error("Return policy is required");
    if (isNaN(window) || window < 0) return toast.error("Enter a valid return window (number of days)");

    upsertPolicy(
      { shippingPolicy, returnPolicy, returnWindow: window, returnRules },
      {
        onSuccess: () => toast.success("Policy saved successfully"),
        onError: () => toast.error("Failed to save policy"),
      }
    );
  };

  return (
    <AdminPage className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Rules &amp; Policy</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your store policies and return rules
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending || isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Spinner className="size-4" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>

      {isError && (
        <p className="text-sm text-red-500">Failed to load policy. Please refresh the page.</p>
      )}

      {isLoading ? (
        <PolicySkeleton />
      ) : (
        <>
          <div className="bg-white rounded-xl p-6 flex flex-col gap-6">
            <RichTextEditor
              label="Shipping policy"
              value={shippingPolicy}
              onChange={setShippingPolicy}
              disabled={isPending}
            />
            <RichTextEditor
              label="Return policy"
              value={returnPolicy}
              onChange={setReturnPolicy}
              disabled={isPending}
            />
          </div>

          <div className="bg-white rounded-xl p-6 flex flex-col gap-5">
            <p className="text-base font-bold text-gray-900">Return Settings</p>

            <div className="flex flex-col gap-1.5 max-w-xs">
              <label className="text-sm font-medium text-gray-700">
                Return window (days)
              </label>
              <input
                type="number"
                min={0}
                value={returnWindow}
                onChange={(e) => setReturnWindow(e.target.value)}
                disabled={isPending}
                placeholder="e.g. 7"
                className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-gray-700">Return rules</p>
              {[
                { value: ReturnRule.CUSTOMER_PAYS, label: "Customer provides return shipping" },
                { value: ReturnRule.FREE_RETURN, label: "Free return shipping" },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setReturnRules(value)}
                    className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      returnRules === value
                        ? "border-gray-900 bg-gray-900"
                        : "border-gray-300 bg-white group-hover:border-gray-400"
                    }`}
                  >
                    {returnRules === value && <div className="size-2 rounded-full bg-white" />}
                  </div>
                  <span
                    onClick={() => setReturnRules(value)}
                    className="text-sm text-gray-700 select-none"
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminPage>
  );
}

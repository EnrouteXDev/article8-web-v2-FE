"use client";

import { usePolicy } from "@/lib/queries/policy";

function PolicyBlock({ title, html }: { title: string; html: string }) {
  return (
    <div className="bg-[#FFEBEB] rounded-xl p-6">
      <h3 className="font-baloo font-bold text-primary text-xl mb-3">{title}</h3>
      <div
        className="font-satoshi text-sm text-primary/70 leading-relaxed prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function PolicySkeleton() {
  return (
    <div className="bg-[#FFEBEB] rounded-xl p-6 animate-pulse flex flex-col gap-3">
      <div className="h-5 w-32 bg-primary/20 rounded" />
      <div className="h-4 w-full bg-primary/10 rounded" />
      <div className="h-4 w-5/6 bg-primary/10 rounded" />
      <div className="h-4 w-4/6 bg-primary/10 rounded" />
    </div>
  );
}

export default function ProductPolicies() {
  const { data, isLoading } = usePolicy();
  const policy = data?.policy;

  return (
    <div className="lg:w-[40%] shrink-0 flex flex-col gap-5">
      {isLoading ? (
        <>
          <PolicySkeleton />
          <PolicySkeleton />
        </>
      ) : (
        <>
          {policy?.shippingPolicy && (
            <PolicyBlock title="Shipping" html={policy.shippingPolicy} />
          )}
          {policy?.returnPolicy && (
            <PolicyBlock title="Return Policy" html={policy.returnPolicy} />
          )}
        </>
      )}
    </div>
  );
}

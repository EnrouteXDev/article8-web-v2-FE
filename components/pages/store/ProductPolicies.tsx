export default function ProductPolicies() {
  return (
    <div className="lg:w-[40%] shrink-0 flex flex-col gap-5">
      {/* Shipping */}
      <div className="bg-[#FFEBEB] rounded-xl p-6">
        <h3 className="font-baloo font-bold text-primary text-xl mb-3">Shipping</h3>
        <p className="font-satoshi text-sm text-primary/70 leading-relaxed mb-3">
          We know how exciting it is to receive your order, so we work hard to get it to you as quickly and reliably as possible. Here&apos;s what you can expect:
        </p>
        <p className="font-satoshi text-sm font-semibold text-primary mb-2">Processing Time</p>
        <ul className="list-disc list-inside font-satoshi text-sm text-primary/70 leading-relaxed space-y-1">
          <li>Orders are typically processed within 1–2 business days, Within state</li>
          <li>During peak seasons or promotional events, processing may take up to 3 business days.</li>
        </ul>
      </div>

      {/* Return Policy */}
      <div className="bg-[#FFEBEB] rounded-xl p-6">
        <h3 className="font-baloo font-bold text-primary text-xl mb-3">Return Policy</h3>
        <p className="font-satoshi text-sm text-primary/70 leading-relaxed mb-3">
          We offer a 7-day return window for items that are unused, in their original packaging, and accompanied by proof of purchase. Returns are not accepted for clearance items, custom orders, or products damaged through misuse. If you receive a defective or incorrect item, you can request an exchange within 3 days of delivery, and we&apos;ll cover the cost of shipping.
        </p>
        <p className="font-satoshi text-sm text-primary/70 leading-relaxed">
          Once we receive and inspect your return, refunds are processed within 5–7 business days to your original payment method. Please note that shipping fees are non-refundable, unless the return is due to our error. For all return or exchange requests, simply reach out to our support team and we&apos;ll guide you through the process smoothly.
        </p>
      </div>
    </div>
  );
}

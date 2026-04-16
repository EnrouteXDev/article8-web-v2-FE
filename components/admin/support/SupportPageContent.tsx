"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  SearchX,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import TicketDetailPanel, {
  type Ticket,
  type TicketStatus,
  type TicketPriority,
} from "@/components/admin/TicketDetailPanel";
import AdminPage from "@/components/admin/shared/AdminPage";
import { useSupportTickets } from "@/lib/queries/support";
import { SupportTicketStatus, type SupportTicket } from "@/lib/types";

const MOCK_PRIORITY: TicketPriority = "Medium";

function mapTicket(t: SupportTicket): Ticket {
  const customer = t.order?.customer;
  const address = customer
    ? [customer.addressLine1, customer.city, customer.state]
        .filter(Boolean)
        .join(", ")
    : "—";
  const date = new Date(t.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return {
    id: String(t.id),
    title: t.complaint.slice(0, 60) + (t.complaint.length > 60 ? "…" : ""),
    customer: t.name,
    email: t.email,
    address,
    phone: t.phoneNumber,
    orderId: `#${t.orderId}`,
    date,
    status: t.status === SupportTicketStatus.RESOLVED ? "Closed" : "Opened",
    priority: MOCK_PRIORITY,
    message: t.complaint,
    attachments: t.images.map((url, i) => ({ name: `image-${i + 1}.jpg`, size: "—" })),
    products: t.product
      ? [
          {
            id: t.product._id,
            name: t.product.name,
            image: t.product.images?.[0] ?? "/artifact1.jpeg",
            qty: 1,
            amount: `£${t.product.price.toFixed(2)}`,
          },
        ]
      : [],
    orderAmount: "—",
    couponDiscount: "—",
    shippingFee: "—",
    total: "—",
  };
}

const priorityStyles: Record<TicketPriority, string> = {
  Low: "text-green-600",
  Medium: "text-orange-500",
  High: "text-red-600",
};

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="py-4 pr-4">
          <div className="h-4 rounded bg-gray-100 animate-pulse" style={{ width: i === 1 ? "140px" : "90px" }} />
        </td>
      ))}
      <td className="py-4">
        <div className="size-6 rounded-md bg-gray-100 animate-pulse" />
      </td>
    </tr>
  );
}

export default function SupportPageContent() {
  const [activeTab, setActiveTab] = useState<TicketStatus>("Opened");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { data, isLoading } = useSupportTickets();
  const tickets = (data?.data ?? []).map(mapTicket);

  const opened = tickets.filter((ticket) => ticket.status === "Opened");
  const closed = tickets.filter((ticket) => ticket.status === "Closed");
  const pool = activeTab === "Opened" ? opened : closed;
  const filtered = search
    ? pool.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(search.toLowerCase()) ||
          ticket.id.toLowerCase().includes(search.toLowerCase()) ||
          ticket.customer.toLowerCase().includes(search.toLowerCase())
      )
    : pool;

  return (
    <AdminPage className="flex flex-col gap-5">
      <div className="bg-white rounded-xl p-6 flex flex-col gap-8">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {(["Opened", "Closed"] as TicketStatus[]).map((tab) => {
              const count = tab === "Opened" ? opened.length : closed.length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-white text-gray-900"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      activeTab === tab
                        ? "bg-gray-100 text-gray-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search email, ID, etc"
                className="w-64 h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <SlidersHorizontal className="size-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2744] text-white text-sm font-medium hover:bg-[#15203a] transition-colors">
              <Plus className="size-4" />
              Create ticket
            </button>
          </div>
        </div>

        {filtered.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center">
              <SearchX className="size-7 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-gray-900">
                No ticket found
              </p>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                We couldn&apos;t find any tickets matching your search. Try a
                different keyword.
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  "Ticket ID",
                  "Title",
                  "Email",
                  "Order ID",
                  "Phone number",
                  "Date",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
                  >
                    {heading}
                  </th>
                ))}
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.map((ticket, index) => {
                const isSelected =
                  selectedTicket?.id === ticket.id &&
                  selectedTicket?.date === ticket.date;

                return (
                  <tr
                    key={index}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`cursor-pointer transition-colors ${
                      index !== filtered.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    } ${isSelected ? "bg-gray-50" : "hover:bg-gray-50"}`}
                  >
                    <td className="py-4 pr-4 text-sm font-medium text-gray-800">
                      {ticket.id}
                    </td>
                    <td className="py-4 pr-4">
                      <p className="text-sm text-gray-800 font-medium">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ticket.customer}
                      </p>
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-500">
                      {ticket.email}
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-500">
                      {ticket.orderId}
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-500">
                      {ticket.phone}
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-500">
                      {ticket.date}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`text-sm font-semibold ${priorityStyles[ticket.priority]}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={(event) => event.stopPropagation()}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailPanel
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </AnimatePresence>
    </AdminPage>
  );
}

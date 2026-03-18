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

const sharedProducts = [
  { id: "1765", name: "Article8 Shirt", image: "/artifact1.jpeg", qty: 1, amount: "£4.99" },
  { id: "8775", name: "Article8 Vans", image: "/artifact2.jpeg", qty: 4, amount: "£4.99" },
  { id: "7665", name: "Article8 Shirt", image: "/artifact3.jpeg", qty: 2, amount: "£4.99" },
  { id: "0987", name: "Article8 Vans", image: "/artifact4.jpeg", qty: 1, amount: "£4.99" },
];

const sharedCustomer = {
  customer: "Aliyu Mudashiru",
  email: "aliyumudahiru@gmail.com",
  address: "372 Kola Lateef Jakande, Lagos",
  phone: "+2348176549880",
  orderId: "#000010",
  orderAmount: "£420.99",
  couponDiscount: "-£20.99",
  shippingFee: "£10.99",
  total: "£410.99",
  products: sharedProducts,
  message:
    "Hello, I received my order but unfortunately the shirt I ordered has a visible defect — there is a small tear on the left sleeve. I have attached photos for reference. I would like to request a return or exchange. Please advise on the next steps. Thank you.",
  attachments: [
    { name: "image.jpg", size: "2.4 MB" },
    { name: "screenshot.jpg", size: "1.1 MB" },
  ],
};

const tickets: Ticket[] = [
  {
    id: "#TKT001",
    title: "Defective item received",
    date: "15/03/21",
    status: "Opened" as TicketStatus,
    priority: "High" as TicketPriority,
    ...sharedCustomer,
  },
  {
    id: "#TKT002",
    title: "Wrong size delivered",
    date: "14/03/21",
    status: "Opened" as TicketStatus,
    priority: "Medium" as TicketPriority,
    ...sharedCustomer,
  },
  {
    id: "#TKT003",
    title: "Package not received",
    date: "13/03/21",
    status: "Opened" as TicketStatus,
    priority: "High" as TicketPriority,
    ...sharedCustomer,
  },
  {
    id: "#TKT004",
    title: "Refund not processed",
    date: "12/03/21",
    status: "Opened" as TicketStatus,
    priority: "Low" as TicketPriority,
    ...sharedCustomer,
  },
  {
    id: "#TKT005",
    title: "Missing item in order",
    date: "11/03/21",
    status: "Opened" as TicketStatus,
    priority: "Medium" as TicketPriority,
    ...sharedCustomer,
  },
  {
    id: "#TKT006",
    title: "Colour different from listing",
    date: "10/03/21",
    status: "Opened" as TicketStatus,
    priority: "Low" as TicketPriority,
    ...sharedCustomer,
  },
  {
    id: "#TKT007",
    title: "Exchange request",
    date: "09/03/21",
    status: "Closed" as TicketStatus,
    priority: "Low" as TicketPriority,
    ...sharedCustomer,
  },
  {
    id: "#TKT008",
    title: "Incorrect billing",
    date: "08/03/21",
    status: "Closed" as TicketStatus,
    priority: "Medium" as TicketPriority,
    ...sharedCustomer,
  },
  {
    id: "#TKT009",
    title: "Delayed delivery",
    date: "07/03/21",
    status: "Closed" as TicketStatus,
    priority: "Low" as TicketPriority,
    ...sharedCustomer,
  },
  {
    id: "#TKT010",
    title: "Coupon not applied",
    date: "06/03/21",
    status: "Closed" as TicketStatus,
    priority: "Medium" as TicketPriority,
    ...sharedCustomer,
  },
];

const priorityStyles: Record<TicketPriority, string> = {
  Low: "text-green-600",
  Medium: "text-orange-500",
  High: "text-red-600",
};

export default function SupportPageContent() {
  const [activeTab, setActiveTab] = useState<TicketStatus>("Opened");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

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

        {filtered.length === 0 ? (
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
              {filtered.map((ticket, index) => {
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

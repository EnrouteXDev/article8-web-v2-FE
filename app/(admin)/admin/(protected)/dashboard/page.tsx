import Image from "next/image";
import Link from "next/link";
import { Search, ChevronsUpDown, Info, SlidersHorizontal, Plus, MoreVertical } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Article8 Shirt",
    image: "/artifact1.jpeg",
    status: "Visible",
    qty: null,
    date: "15 Mar 2021",
    amount: "$4.99",
  },
  {
    id: 2,
    name: "Article8 Shirt",
    image: "/artifact2.jpeg",
    status: "Visible",
    qty: 3,
    date: "15 Mar 2021",
    amount: "$4.99",
  },
  {
    id: 3,
    name: "Article8 Shirt",
    image: "/artifact3.jpeg",
    status: "Visible",
    qty: 3,
    date: "15 Mar 2021",
    amount: "$4.99",
  },
  {
    id: 4,
    name: "Article8 Shirt",
    image: "/artifact4.jpeg",
    status: "Hidden",
    qty: 3,
    date: "15 Mar 2021",
    amount: "$4.99",
  },
];

export default function AdminDashboardPage() {
  return (
    <div
      className="bg-white rounded-xl p-6 flex flex-col gap-5"
      style={{ fontFamily: "var(--font-satoshi)" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-gray-800">
          {products.length} products in store
        </span>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <SlidersHorizontal className="size-4" />
            Filters
          </button>
          <Link
            href="/admin/products/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
          >
            <Plus className="size-4" />
            Create new product
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search item"
          className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-3 text-left">
              <button className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:text-gray-600 transition-colors">
                Product <ChevronsUpDown className="size-3" />
              </button>
            </th>
            <th className="pb-3 text-left">
              <button className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:text-gray-600 transition-colors">
                Status <Info className="size-3" />
              </button>
            </th>
            <th className="pb-3 text-left">
              <button className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:text-gray-600 transition-colors">
                Qty in Stock <ChevronsUpDown className="size-3" />
              </button>
            </th>
            <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Date Created
            </th>
            <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Amount
            </th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={`${index !== products.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}
            >
              {/* Product */}
              <td className="py-3.5 pr-6">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-md overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {product.name}
                  </span>
                </div>
              </td>

              {/* Status */}
              <td className="py-3.5 pr-6">
                {product.status === "Visible" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-xs font-medium">
                    <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
                    Visible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 text-xs font-medium">
                    <span className="size-1.5 rounded-full bg-gray-400 shrink-0" />
                    Hidden
                  </span>
                )}
              </td>

              {/* Qty */}
              <td className="py-3.5 pr-6">
                {product.qty === null ? (
                  <span className="text-sm text-red-500 font-medium">
                    Out of stock
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-8 h-7 rounded-md bg-gray-100 text-sm text-gray-700 font-medium">
                    {product.qty}
                  </span>
                )}
              </td>

              {/* Date */}
              <td className="py-3.5 pr-6 text-sm text-gray-600">
                {product.date}
              </td>

              {/* Amount */}
              <td className="py-3.5 pr-6 text-sm text-gray-800 font-medium">
                {product.amount}
              </td>

              {/* Actions */}
              <td className="py-3.5">
                <button className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                  <MoreVertical className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

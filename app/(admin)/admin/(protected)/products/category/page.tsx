import Link from "next/link";
import { Search, ChevronsUpDown, SlidersHorizontal, Plus, Trash2 } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "All",
    products: ["All products"],
    date: "15 Mar 2021",
  },
  {
    id: 2,
    name: "Shirts",
    products: ["Article8 Shirt", "Article8 Tops", "Article8 Shirt"],
    extra: 2,
    date: "15 Mar 2021",
  },
];

export default function ProductCategoryPage() {
  return (
    <div
      className="bg-white rounded-xl p-6 flex flex-col gap-5"
      style={{ fontFamily: "var(--font-satoshi)" }}
    >
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500">
        <span className="text-gray-800 font-medium">Products</span>
        <span className="mx-1">/</span>
        Category
      </p>

      {/* Top bar */}
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search item"
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <SlidersHorizontal className="size-4" />
            Filters
          </button>
          <Link
            href="/admin/products/category/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="size-4" />
            Create category
          </Link>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Name
            </th>
            <th className="pb-3 text-left">
              <button className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:text-gray-600 transition-colors">
                Product <ChevronsUpDown className="size-3" />
              </button>
            </th>
            <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Date Created
            </th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr
              key={cat.id}
              className={`${index !== categories.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}
            >
              {/* Name */}
              <td className="py-4 pr-6 text-sm font-medium text-gray-800 w-48">
                {cat.name}
              </td>

              {/* Products */}
              <td className="py-4 pr-6">
                <div className="flex items-center gap-2 flex-wrap">
                  {cat.products.map((p, i) => (
                    <span
                      key={i}
                      className="text-sm font-semibold text-gray-700"
                    >
                      {p}
                    </span>
                  ))}
                  {cat.extra && (
                    <span className="text-sm text-gray-400 font-medium">
                      +{cat.extra} more
                    </span>
                  )}
                </div>
              </td>

              {/* Date */}
              <td className="py-4 pr-6 text-sm text-gray-500">{cat.date}</td>

              {/* Delete */}
              <td className="py-4">
                <button className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

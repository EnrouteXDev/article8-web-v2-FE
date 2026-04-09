"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminPage from "@/components/admin/shared/AdminPage";
import { useCategories, useDeleteCategory } from "@/lib/queries/categories";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const VISIBLE_PRODUCTS = 3;

export default function ProductCategoryPageContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const limit = 10;

  const { data, isLoading, isError } = useCategories({
    search: search || undefined,
    page,
    limit,
  });
  const { mutate: remove, isPending: isDeleting } = useDeleteCategory();

  const handleDelete = () => {
    if (!deleteTarget) return;
    remove(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`"${deleteTarget.name}" deleted`);
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete category");
      },
    });
  };

  const categories = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <AdminPage className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-5">
      <p className="text-sm text-gray-500">
        <span className="text-gray-800 font-medium">Products</span>
        <span className="mx-1">/</span>
        Category
      </p>

      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 md:w-72 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search item"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/category/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="size-4" />
            Create category
          </Link>
        </div>
      </div>

      {isError && (
        <p className="text-sm text-red-500">Failed to load categories.</p>
      )}

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 rounded-xl border border-gray-100 animate-pulse flex flex-col gap-2">
              <div className="h-4 w-28 rounded bg-gray-100" />
              <div className="h-3 w-40 rounded bg-gray-100" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>
          ))
        ) : categories.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-10">No categories found.</p>
        ) : (
          categories.map((category) => {
            const visible = category.products.slice(0, VISIBLE_PRODUCTS);
            const extra = category.products.length - VISIBLE_PRODUCTS;
            return (
              <div key={category._id} className="p-3 rounded-xl border border-gray-100 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{category.name}</p>
                  <p className="text-xs text-gray-500">
                    {category.products.length === 0 ? "No products" : (
                      <>
                        {visible.map(p => p.name).join(", ")}
                        {extra > 0 && ` +${extra} more`}
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(category.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget({ id: category._id, name: category.name })}
                  className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop table */}
      <table className="hidden md:table w-full text-sm">
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
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-4 pr-6 w-48">
                  <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
                </td>
                <td className="py-4 pr-6">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-20 rounded bg-gray-100 animate-pulse" />
                    <div className="h-4 w-20 rounded bg-gray-100 animate-pulse" />
                    <div className="h-4 w-12 rounded bg-gray-100 animate-pulse" />
                  </div>
                </td>
                <td className="py-4 pr-6">
                  <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
                </td>
                <td className="py-4">
                  <div className="size-7 rounded-md bg-gray-100 animate-pulse" />
                </td>
              </tr>
            ))
          ) : categories.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="py-16 text-center text-sm text-gray-400"
              >
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((category, index) => {
              const visible = category.products.slice(0, VISIBLE_PRODUCTS);
              const extra = category.products.length - VISIBLE_PRODUCTS;

              return (
                <tr
                  key={category._id}
                  className={`${index !== categories.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}
                >
                  <td className="py-4 pr-6 text-sm font-medium text-gray-800 w-48">
                    {category.name}
                  </td>
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      {visible.map((product) => (
                        <span
                          key={product._id}
                          className="text-sm font-semibold text-gray-700"
                        >
                          {product.name}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span className="text-sm text-gray-400 font-medium">
                          +{extra} more
                        </span>
                      )}
                      {category.products.length === 0 && (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-6 text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => setDeleteTarget({ id: category._id, name: category.name })}
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open && !isDeleting) setDeleteTarget(null); }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">&quot;{deleteTarget?.name}&quot;</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Spinner className="size-3.5" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  );
}

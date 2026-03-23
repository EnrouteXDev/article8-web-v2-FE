"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ChevronsUpDown,
  Info,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  ChevronDown,
  Trash2,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import AdminPage from "@/components/admin/shared/AdminPage";
import { useProducts, useDeleteProduct, useHideProduct } from "@/lib/queries/products";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { ProductStatus } from "@/lib/types";

const STATUS_OPTIONS = [
  { label: "All", value: undefined },
  { label: "Visible", value: ProductStatus.VISIBLE },
  { label: "Hidden", value: ProductStatus.HIDDEN },
  { label: "Out of stock", value: ProductStatus.OUT_OF_STOCK },
] as const;

export default function DashboardPageContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ProductStatus | undefined>(undefined);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [hideTarget, setHideTarget] = useState<{ id: string; name: string } | null>(null);
  const limit = 10;

  const { data, isLoading, isError } = useProducts({ search: search || undefined, status, page, limit });
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutate: hideProduct, isPending: isHiding } = useHideProduct();

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`"${deleteTarget.name}" deleted`);
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete product");
      },
    });
  };

  const handleHide = () => {
    if (!hideTarget) return;
    hideProduct(hideTarget.id, {
      onSuccess: () => {
        toast.success(`"${hideTarget.name}" hidden`);
        setHideTarget(null);
      },
      onError: () => {
        toast.error("Failed to hide product");
      },
    });
  };

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <AdminPage className="bg-white rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-gray-800">
          {isLoading ? (
            <div className="h-5 w-36 rounded bg-gray-100 animate-pulse" />
          ) : (
            `${data?.total ?? 0} products in store`
          )}
        </span>
        <div className="flex items-center gap-3">
          <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-2 text-sm transition-colors ${status ? "text-primary font-medium" : "text-gray-600 hover:text-gray-900"}`}
              >
                <SlidersHorizontal className="size-4" />
                {status ? STATUS_OPTIONS.find((o) => o.value === status)?.label : "Filters"}
                <ChevronDown className={`size-3.5 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={String(option.value)}
                  onSelect={() => {
                    setStatus(option.value as ProductStatus | undefined);
                    setPage(1);
                  }}
                  className={`flex items-center justify-between ${status === option.value ? "text-primary font-medium" : ""}`}
                >
                  {option.label}
                  {status === option.value && (
                    <span className="size-1.5 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/admin/products/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
          >
            <Plus className="size-4" />
            Create new product
          </Link>
        </div>
      </div>

      <div className="relative w-72">
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

      {isError && (
        <p className="text-sm text-red-500">Failed to load products.</p>
      )}

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
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                {/* Product */}
                <td className="py-3.5 pr-6">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-md bg-gray-100 animate-pulse shrink-0" />
                    <div className="h-4 w-32 rounded bg-gray-100 animate-pulse" />
                  </div>
                </td>
                {/* Status */}
                <td className="py-3.5 pr-6">
                  <div className="h-6 w-16 rounded-md bg-gray-100 animate-pulse" />
                </td>
                {/* Qty */}
                <td className="py-3.5 pr-6">
                  <div className="h-7 w-8 rounded-md bg-gray-100 animate-pulse" />
                </td>
                {/* Date */}
                <td className="py-3.5 pr-6">
                  <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
                </td>
                {/* Amount */}
                <td className="py-3.5 pr-6">
                  <div className="h-4 w-14 rounded bg-gray-100 animate-pulse" />
                </td>
                {/* Action */}
                <td className="py-3.5">
                  <div className="size-6 rounded-md bg-gray-100 animate-pulse" />
                </td>
              </tr>
            ))
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr
                key={product._id}
                className={`${index !== products.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}
              >
                <td className="py-3.5 pr-6">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-md overflow-hidden shrink-0 bg-gray-100">
                      {product.images?.[0]?.startsWith("http") && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 pr-6">
                  {product.status === ProductStatus.VISIBLE ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-xs font-medium">
                      <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
                      Visible
                    </span>
                  ) : product.status === ProductStatus.OUT_OF_STOCK ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-500 text-xs font-medium">
                      <span className="size-1.5 rounded-full bg-red-400 shrink-0" />
                      Out of stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 text-xs font-medium">
                      <span className="size-1.5 rounded-full bg-gray-400 shrink-0" />
                      Hidden
                    </span>
                  )}
                </td>
                <td className="py-3.5 pr-6">
                  {product.quantity === 0 ? (
                    <span className="text-sm text-red-500 font-medium">
                      Out of stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-8 h-7 rounded-md bg-gray-100 text-sm text-gray-700 font-medium">
                      {product.quantity}
                    </span>
                  )}
                </td>
                <td className="py-3.5 pr-6 text-sm text-gray-600">
                  {new Date(product.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3.5 pr-6 text-sm text-gray-800 font-medium">
                  £{product.price.toFixed(2)}
                </td>
                <td className="py-3.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <MoreVertical className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white! z-50!">
                      <DropdownMenuGroup>
                        {product.status === ProductStatus.VISIBLE && (
                          <DropdownMenuItem
                            onSelect={() => setHideTarget({ id: product._id, name: product.name })}
                          >
                            <EyeOff />
                            Hide
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => setDeleteTarget({ id: product._id, name: product.name })}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
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
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">&quot;{deleteTarget?.name}&quot;</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button  onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Spinner className="size-3.5" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!hideTarget}
        onOpenChange={(open) => { if (!open && !isHiding) setHideTarget(null); }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Hide product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to hide{" "}
              <span className="font-medium text-foreground">&quot;{hideTarget?.name}&quot;</span>?
              It will no longer be visible in the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isHiding}>Cancel</AlertDialogCancel>
            <Button onClick={handleHide} disabled={isHiding}>
              {isHiding && <Spinner className="size-3.5" />}
              {isHiding ? "Hiding..." : "Hide"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  );
}

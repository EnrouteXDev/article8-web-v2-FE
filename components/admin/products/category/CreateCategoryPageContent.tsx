"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, X } from "lucide-react";
import AdminPage from "@/components/admin/shared/AdminPage";
import { Spinner } from "@/components/ui/spinner";
import { useProducts } from "@/lib/queries/products";
import { useCreateCategory } from "@/lib/queries/categories";
import { createCategorySchema, type CreateCategoryFormValues } from "@/lib/schemas";

export default function CreateCategoryPageContent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "" },
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 100 });
  const { mutate: createCategory, isPending, error } = useCreateCategory();

  const allProducts = productsData?.data ?? [];

  const errorMessage =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any)?.response?.data?.message ?? (error ? "Failed to create category." : null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleProduct = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const onSubmit = (values: CreateCategoryFormValues) => {
    createCategory({ name: values.name, products: selectedIds });
  };

  const selectedProducts = allProducts.filter((p) => selectedIds.includes(p._id));

  return (
    <AdminPage className="bg-white rounded-xl p-6">
      <p className="text-sm text-gray-500 mb-5">
        <span className="text-gray-800 font-medium">Products</span>
        <span className="mx-1">/</span>
        <span className="text-gray-800 font-medium">Category</span>
        <span className="mx-1">/</span>
        Create category
      </p>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Category Information
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Users will search your product by category. Use words that best
            describes the product
          </p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
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

      {errorMessage && (
        <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
      )}

      <div className="flex flex-col gap-6 max-w-lg">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Category name
          </label>
          <input
            type="text"
            disabled={isPending}
            className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors disabled:opacity-50"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Select product
          </label>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              disabled={isLoadingProducts || isPending}
              className="w-full h-11 px-4 flex items-center justify-between rounded-lg border border-gray-200 text-sm text-gray-400 bg-white hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {isLoadingProducts ? "Loading products..." : "Select products"}
              </span>
              {isLoadingProducts ? (
                <Spinner className="size-4 text-gray-400" />
              ) : (
                <ChevronDown
                  className={`size-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {dropdownOpen && allProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto">
                {allProducts.map((product) => {
                  const isSelected = selectedIds.includes(product._id);

                  return (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => toggleProduct(product._id)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-primary/5 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {product.name}
                      {isSelected && (
                        <span className="size-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedProducts.map((product) => (
                <span
                  key={product._id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 bg-white"
                >
                  {product.name}
                  <button
                    type="button"
                    onClick={() => toggleProduct(product._id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}

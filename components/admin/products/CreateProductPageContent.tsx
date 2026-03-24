"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UploadCloud, ShoppingCart } from "lucide-react";
import AdminPage from "@/components/admin/shared/AdminPage";
import { useCreateProduct } from "@/lib/queries/products";
import { Spinner } from "@/components/ui/spinner";
import { createProductSchema, type CreateProductFormValues } from "@/lib/schemas";
import { uploadImages } from "@/lib/utils/cloudinary";

export default function CreateProductPageContent() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { name: "", url: "", price: "", quantity: "", description: "" },
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreRef = useRef<HTMLInputElement>(null);

  const { mutate: createProduct, isPending, error } = useCreateProduct();

  const errorMessage =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any)?.response?.data?.message ?? (error ? "Failed to create product." : null);

  const name = watch("name");
  const price = watch("price");
  const quantity = watch("quantity");
  const description = watch("description");

  const handleNameChange = (value: string) => {
    setValue("name", value, { shouldValidate: true });
    setValue("url", value.trim().replace(/\s+/g, "-"), { shouldValidate: true });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 4 - imageFiles.length);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const onSubmit = async (values: CreateProductFormValues) => {
    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      setIsUploading(true);
      try {
        imageUrls = await uploadImages(imageFiles);
      } catch {
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    createProduct(
      {
        name: values.name,
        url: values.url,
        price: parseFloat(values.price),
        quantity: parseInt(values.quantity, 10),
        description: values.description,
        images: imageUrls,
      },
      {
        onSuccess: () => {
          toast.success("Product published successfully");
          router.push("/admin/dashboard");
        },
        onError: (err) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const message = (err as any)?.response?.data?.message ?? "Failed to publish product";
          toast.error(message);
        },
      },
    );
  };

  const isBusy = isUploading || isPending;

  const displayName = name || "New Product";
  const displayPrice = price ? `£${price}` : "£0.00";
  const displayQty = quantity ? parseInt(quantity, 10) : 0;

  return (
    <AdminPage className="bg-white rounded-xl p-4 md:p-6">
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Product Information
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            This is the information of the product that will be displayed to
            customers
          </p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isBusy}
          className="flex items-center gap-2 px-5 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Spinner className="size-4" />
              Uploading images...
            </>
          ) : isPending ? (
            <>
              <Spinner className="size-4" />
              Publishing...
            </>
          ) : (
            "Publish"
          )}
        </button>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
      )}

      <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-10">
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Product name
            </label>
            <input
              type="text"
              placeholder="New Product"
              disabled={isPending}
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors disabled:opacity-50"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Product url
            </label>
            <input
              type="text"
              placeholder="new-product"
              disabled={isPending}
              className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors disabled:opacity-50"
              {...register("url")}
            />
            {errors.url && (
              <p className="text-xs text-red-500">{errors.url.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Price</label>
            <input
              type="text"
              placeholder="£0.00"
              disabled={isPending}
              className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors disabled:opacity-50"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Quantity available
            </label>
            <input
              type="number"
              placeholder="0"
              disabled={isPending}
              className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors disabled:opacity-50"
              {...register("quantity")}
            />
            {errors.quantity && (
              <p className="text-xs text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Product description
            </label>
            <textarea
              placeholder="Enter a description..."
              rows={5}
              disabled={isPending}
              className="px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors resize-none disabled:opacity-50"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Upload images
            </label>

            {imagePreviews.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  handleFiles(event.dataTransfer.files);
                }}
                className={`flex flex-col items-center justify-center gap-2 py-10 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <UploadCloud className="size-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {imagePreviews.map((src, index) => (
                    <div
                      key={index}
                      className="relative size-24 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                    >
                      <Image
                        src={src}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addMoreRef.current?.click()}
                    className="size-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors shrink-0 text-2xl"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  You can drag images to re-order as it should appear on
                  website. First image automatically is primary image
                </p>
                <input
                  ref={addMoreRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => handleFiles(event.target.files)}
                />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0">
          <div className="border border-gray-200 rounded-xl p-4 md:sticky md:top-6">
            <p className="text-base font-semibold text-gray-900">Preview</p>
            <p className="text-xs text-gray-500 mt-0.5 mb-4">
              This is a preview of how the product will appear on the website
            </p>

            <div className="w-full aspect-4/3 rounded-lg bg-gray-100 overflow-hidden mb-2">
              {imagePreviews[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreviews[0]}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="aspect-square rounded-md bg-gray-100 overflow-hidden"
                >
                  {imagePreviews[index] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreviews[index]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-primary">
                {displayName}
              </span>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary text-white text-xs font-medium">
                <ShoppingCart className="size-3" />
                Add to cart
              </button>
            </div>

            <p className="text-base font-bold text-primary">{displayPrice}</p>
            <p className="text-xs text-primary mb-3">
              Only {displayQty} left in stock
            </p>

            <p className="text-xs text-gray-400 mb-4 line-clamp-2">
              {description || "Preview of product description appears here.."}
            </p>

            <button className="w-full py-3 rounded-lg bg-primary text-white text-sm font-semibold">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}

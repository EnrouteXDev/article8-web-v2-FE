"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { UploadCloud, ShoppingCart } from "lucide-react";

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    setUrl(val.trim().replace(/\s+/g, "-"));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newUrls = Array.from(files).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...newUrls]);
  };


  const displayName = name || "New Product";
  const displayPrice = price ? `£${price}` : "£0.00";
  const displayQty = quantity ? parseInt(quantity) : 0;

  return (
    <div
      className="bg-white rounded-xl p-6"
      style={{ fontFamily: "var(--font-satoshi)" }}
    >
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Product Information
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            This is the information of the product that will be displayed to
            customers
          </p>
        </div>
        <button className="px-5 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors">
          Publish
        </button>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-10">
        {/* ── Left: form ── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Product name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Product name
            </label>
            <input
              type="text"
              placeholder="New Product"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* Product URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Product url
            </label>
            <input
              type="text"
              placeholder="new-product"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Price</label>
            <input
              type="text"
              placeholder="£0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Quantity available
            </label>
            <input
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Product description
            </label>
            <textarea
              placeholder="Enter a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors resize-none"
            />
          </div>

          {/* Upload images */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Upload images
            </label>

            {images.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFiles(e.dataTransfer.files);
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
                  SVG, PNG, JPG or GIF (max. 800×400px)
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="relative size-24 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                    >
                      <Image
                        src={src}
                        alt={`Product image ${i + 1}`}
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
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

        </div>

        {/* ── Right: live preview ── */}
        <div className="w-80 shrink-0">
          <div className="border border-gray-200 rounded-xl p-4 sticky top-6">
            <p className="text-base font-semibold text-gray-900">Preview</p>
            <p className="text-xs text-gray-500 mt-0.5 mb-4">
              This is a preview of how the product will appear on the website
            </p>

            {/* Primary image */}
            <div className="w-full aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden mb-2">
              {images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[0]}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Thumbnails (images 2–4) */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md bg-gray-100 overflow-hidden"
                >
                  {images[i] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={images[i]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Name + Add to cart */}
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
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { useForm, useFieldArray, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UploadCloud, Plus, Trash2, X } from "lucide-react";
import AdminPage from "@/components/admin/shared/AdminPage";
import { Spinner } from "@/components/ui/spinner";
import { heroSlideSchema, type HeroSlideFormValues } from "@/lib/schemas";
import { uploadImage } from "@/lib/utils/cloudinary";
import type { CreateHeroSlideInput, HeroSlide } from "@/lib/types";

// ─── Value mapping ────────────────────────────────────────────────────────────

export const emptyHeroSlideValues: HeroSlideFormValues = {
  title: "",
  topSubtitle: "",
  bottomSubtitle: "",
  image: "",
  mobileImage: "",
  imageAlt: "",
  backgroundVideo: "",
  hideText: false,
  comingSoon: false,
  textAlign: "left",
  showOverlay: true,
  overlayOpacity: 0.5,
  order: 0,
  isActive: true,
  startDate: "",
  endDate: "",
  buttons: [],
};

const toDateInput = (value?: string | null) => (value ? value.slice(0, 10) : "");

export function slideToFormValues(slide: HeroSlide): HeroSlideFormValues {
  return {
    title: slide.title ?? "",
    topSubtitle: slide.topSubtitle ?? "",
    bottomSubtitle: slide.bottomSubtitle ?? "",
    image: slide.image ?? "",
    mobileImage: slide.mobileImage ?? "",
    imageAlt: slide.imageAlt ?? "",
    backgroundVideo: slide.backgroundVideo ?? "",
    hideText: slide.hideText ?? false,
    comingSoon: slide.comingSoon ?? false,
    textAlign: slide.textAlign ?? "left",
    showOverlay: slide.showOverlay ?? !slide.hideText,
    overlayOpacity: slide.overlayOpacity ?? 0.5,
    order: slide.order ?? 0,
    isActive: slide.isActive ?? true,
    startDate: toDateInput(slide.startDate),
    endDate: toDateInput(slide.endDate),
    buttons: (slide.buttons ?? []).map((b) => ({
      text: b.text,
      variant: b.variant ?? "solid",
      action: b.action ?? "link",
      href: b.href ?? "",
      videoUrl: b.videoUrl ?? "",
    })),
  };
}

export function formValuesToInput(values: HeroSlideFormValues): CreateHeroSlideInput {
  const clean = (v?: string) => (v ?? "").trim();
  return {
    title: clean(values.title),
    topSubtitle: clean(values.topSubtitle),
    bottomSubtitle: clean(values.bottomSubtitle),
    image: clean(values.image),
    mobileImage: clean(values.mobileImage),
    imageAlt: clean(values.imageAlt),
    backgroundVideo: clean(values.backgroundVideo),
    hideText: values.hideText,
    comingSoon: values.comingSoon,
    textAlign: values.textAlign,
    showOverlay: values.showOverlay,
    overlayOpacity: values.overlayOpacity,
    order: values.order,
    isActive: values.isActive,
    startDate: values.startDate ? new Date(`${values.startDate}T00:00:00`).toISOString() : null,
    endDate: values.endDate ? new Date(`${values.endDate}T23:59:59`).toISOString() : null,
    buttons: values.buttons.map((b) => ({
      text: clean(b.text),
      variant: b.variant,
      action: b.action,
      href: b.action === "link" ? clean(b.href) : undefined,
      videoUrl: b.action === "showreel" ? clean(b.videoUrl) : undefined,
    })),
  };
}

// ─── Small controls ───────────────────────────────────────────────────────────

const inputClass =
  "h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors disabled:opacity-50 bg-white";
const selectClass = `${inputClass} appearance-none`;

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex items-start justify-between gap-4 w-full text-left rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors disabled:opacity-50"
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {description && <span className="text-xs text-gray-500">{description}</span>}
      </span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
}

/** Image picker that accepts a Cloudinary upload or a pasted URL. */
function ImageField({
  label,
  hint,
  value,
  error,
  disabled,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files can be uploaded here");
      return;
    }
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed. Paste an image URL instead.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Field label={label} hint={hint} error={error}>
      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("")}
            className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            aria-label="Remove image"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFile(event.dataTransfer.files?.[0]);
          }}
          className={`flex flex-col items-center justify-center gap-2 py-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          {isUploading ? (
            <Spinner className="size-6 text-gray-400" />
          ) : (
            <UploadCloud className="size-7 text-gray-400" />
          )}
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">PNG or JPG, 1920×1080 recommended</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <input
        type="url"
        placeholder="or paste an image URL"
        value={value}
        disabled={disabled || isUploading}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

// ─── Live preview ─────────────────────────────────────────────────────────────

function SlidePreview({ form }: { form: UseFormReturn<HeroSlideFormValues> }) {
  const values = form.watch();
  const showOverlay = values.showOverlay;
  const centered = values.textAlign === "center";

  return (
    <div className="border border-gray-200 rounded-xl p-4 md:sticky md:top-6">
      <p className="text-base font-semibold text-gray-900">Preview</p>
      <p className="text-xs text-gray-500 mt-0.5 mb-4">
        Approximation of how the slide will appear on the home page
      </p>

      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
        {values.backgroundVideo ? (
          <video
            key={values.backgroundVideo}
            src={values.backgroundVideo}
            poster={values.image || undefined}
            muted
            loop
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : values.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={values.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : null}

        {showOverlay && (
          <div className="absolute inset-0 bg-black" style={{ opacity: values.overlayOpacity }} />
        )}

        <div
          className={`absolute inset-0 p-4 flex flex-col justify-center ${
            centered ? "items-center text-center" : "items-start text-left"
          }`}
        >
          <span
            className="font-satoshi text-white text-2xl leading-none"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
          >
            01
          </span>
          {!values.hideText && (
            <>
              {values.topSubtitle && (
                <p className="font-baloo-2 font-semibold text-white text-[10px] uppercase tracking-wide mt-1">
                  {values.topSubtitle}
                </p>
              )}
              <p className="font-baloo font-bold text-white text-xl leading-[0.95] tracking-wide mt-0.5 line-clamp-2">
                {values.title || "Slide title"}
              </p>
              {values.bottomSubtitle && (
                <p className="font-satoshi text-white/80 text-[10px] mt-1 line-clamp-2 max-w-[80%]">
                  {values.bottomSubtitle}
                </p>
              )}
              {values.comingSoon && (
                <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full border border-white/40 bg-white/10 text-white text-[8px] uppercase tracking-widest">
                  Coming Soon
                </span>
              )}
            </>
          )}
          {values.buttons.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {values.buttons.map((b, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded text-[8px] uppercase font-medium ${
                    b.variant === "outline"
                      ? "border border-white text-white bg-white/10"
                      : "bg-white text-primary"
                  }`}
                >
                  {b.text || "Button"}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            values.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
          }`}
        >
          {values.isActive ? "Active" : "Inactive"}
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
          Order {values.order ?? 0}
        </span>
        {(values.startDate || values.endDate) && (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
            {values.startDate || "…"} → {values.endDate || "…"}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface HeroSlideFormProps {
  heading: string;
  subheading: string;
  submitLabel: string;
  pendingLabel: string;
  defaultValues: HeroSlideFormValues;
  isPending: boolean;
  errorMessage?: string | null;
  onSubmit: (values: HeroSlideFormValues) => void;
}

export default function HeroSlideForm({
  heading,
  subheading,
  submitLabel,
  pendingLabel,
  defaultValues,
  isPending,
  errorMessage,
  onSubmit,
}: HeroSlideFormProps) {
  const form = useForm<HeroSlideFormValues>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = form;

  const { fields: buttonFields, append, remove } = useFieldArray({ control, name: "buttons" });

  const image = watch("image");
  const mobileImage = watch("mobileImage");
  const hideText = watch("hideText");
  const comingSoon = watch("comingSoon");
  const showOverlay = watch("showOverlay");
  const overlayOpacity = watch("overlayOpacity");
  const isActive = watch("isActive");
  const buttons = watch("buttons");

  return (
    <AdminPage className="bg-white rounded-xl p-4 md:p-6">
      <div className="flex items-start justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{heading}</h1>
          <p className="text-sm text-gray-500 mt-1">{subheading}</p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isPending ? (
            <>
              <Spinner className="size-4" />
              {pendingLabel}
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>

      {errorMessage && <p className="text-sm text-red-500 mb-4">{errorMessage}</p>}

      <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col gap-8 min-w-0"
        >
          {/* Text */}
          <section className="flex flex-col gap-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Text</h2>

            <Field label="Title" error={errors.title?.message}>
              <input
                type="text"
                placeholder="SKYFALL"
                disabled={isPending}
                className={inputClass}
                {...register("title")}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Top subtitle" hint="Small line above the title">
                <input
                  type="text"
                  placeholder="Coming Soon to Your Screen"
                  disabled={isPending}
                  className={inputClass}
                  {...register("topSubtitle")}
                />
              </Field>
              <Field label="Text alignment">
                <select disabled={isPending} className={selectClass} {...register("textAlign")}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                </select>
              </Field>
            </div>

            <Field label="Bottom subtitle" hint="Short description under the title">
              <textarea
                rows={3}
                placeholder="An opportunity for creatives to contribute…"
                disabled={isPending}
                className="px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors resize-none disabled:opacity-50"
                {...register("bottomSubtitle")}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle
                label="Hide text"
                description="Artwork already carries the text; show only the index and buttons"
                checked={hideText}
                disabled={isPending}
                onChange={(next) => {
                  setValue("hideText", next, { shouldDirty: true });
                  setValue("showOverlay", !next, { shouldDirty: true });
                }}
              />
              <Toggle
                label="Coming soon badge"
                checked={comingSoon}
                disabled={isPending}
                onChange={(next) => setValue("comingSoon", next, { shouldDirty: true })}
              />
            </div>
          </section>

          {/* Media */}
          <section className="flex flex-col gap-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Media</h2>

            <ImageField
              label="Background image"
              hint="Also used as the poster while a background video loads"
              value={image}
              error={errors.image?.message}
              disabled={isPending}
              onChange={(url) => setValue("image", url, { shouldValidate: true, shouldDirty: true })}
            />

            <ImageField
              label="Mobile image (optional)"
              hint="Portrait crop shown on phones instead of the background image"
              value={mobileImage ?? ""}
              disabled={isPending}
              onChange={(url) => setValue("mobileImage", url, { shouldDirty: true })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Background video URL (optional)" hint="Plays muted on loop behind the text">
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/…/video.mp4"
                  disabled={isPending}
                  className={inputClass}
                  {...register("backgroundVideo")}
                />
              </Field>
              <Field label="Image alt text">
                <input
                  type="text"
                  placeholder="Describe the image"
                  disabled={isPending}
                  className={inputClass}
                  {...register("imageAlt")}
                />
              </Field>
            </div>

            <div className="flex flex-col gap-3">
              <Toggle
                label="Dark overlay"
                description="Darkens the artwork so white text stays readable"
                checked={showOverlay}
                disabled={isPending}
                onChange={(next) => setValue("showOverlay", next, { shouldDirty: true })}
              />
              {showOverlay && (
                <Field label={`Overlay strength · ${Math.round(overlayOpacity * 100)}%`}>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    disabled={isPending}
                    className="w-full accent-primary"
                    {...register("overlayOpacity", { valueAsNumber: true })}
                  />
                </Field>
              )}
            </div>
          </section>

          {/* Buttons */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Buttons</h2>
              {buttonFields.length < 2 && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    append({ text: "", variant: buttonFields.length === 0 ? "solid" : "outline", action: "link", href: "", videoUrl: "" })
                  }
                  className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline disabled:opacity-50"
                >
                  <Plus className="size-4" />
                  Add button
                </button>
              )}
            </div>

            {buttonFields.length === 0 && (
              <p className="text-sm text-gray-400">No buttons. Add up to two.</p>
            )}

            {buttonFields.map((field, index) => {
              const action = buttons?.[index]?.action ?? "link";
              const buttonErrors = errors.buttons?.[index];
              return (
                <div key={field.id} className="rounded-lg border border-gray-200 p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Button {index + 1}</span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => remove(index)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Remove button"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Text" error={buttonErrors?.text?.message}>
                      <input
                        type="text"
                        placeholder="SHOP NOW"
                        disabled={isPending}
                        className={inputClass}
                        {...register(`buttons.${index}.text` as const)}
                      />
                    </Field>
                    <Field label="Action">
                      <select
                        disabled={isPending}
                        className={selectClass}
                        {...register(`buttons.${index}.action` as const)}
                      >
                        <option value="link">Go to a link</option>
                        <option value="showreel">Play a video</option>
                      </select>
                    </Field>
                    <Field label="Style">
                      <select
                        disabled={isPending}
                        className={selectClass}
                        {...register(`buttons.${index}.variant` as const)}
                      >
                        <option value="solid">Solid (white)</option>
                        <option value="outline">Outline</option>
                      </select>
                    </Field>
                  </div>

                  {action === "showreel" ? (
                    <Field label="Video URL" error={buttonErrors?.videoUrl?.message}>
                      <input
                        type="url"
                        placeholder="https://res.cloudinary.com/…/showreel.mp4"
                        disabled={isPending}
                        className={inputClass}
                        {...register(`buttons.${index}.videoUrl` as const)}
                      />
                    </Field>
                  ) : (
                    <Field label="Link" hint="Internal path like /store or a full URL" error={buttonErrors?.href?.message}>
                      <input
                        type="text"
                        placeholder="/store"
                        disabled={isPending}
                        className={inputClass}
                        {...register(`buttons.${index}.href` as const)}
                      />
                    </Field>
                  )}
                </div>
              );
            })}
            {typeof errors.buttons?.message === "string" && (
              <p className="text-xs text-red-500">{errors.buttons.message}</p>
            )}
          </section>

          {/* Publishing */}
          <section className="flex flex-col gap-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Publishing</h2>

            <Toggle
              label="Active"
              description="Inactive slides stay saved but are not shown on the website"
              checked={isActive}
              disabled={isPending}
              onChange={(next) => setValue("isActive", next, { shouldDirty: true })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Field label="Order" hint="Lower numbers show first" error={errors.order?.message}>
                <input
                  type="number"
                  min={0}
                  step={1}
                  disabled={isPending}
                  className={inputClass}
                  {...register("order", { valueAsNumber: true })}
                />
              </Field>
              <Field label="Start date (optional)" error={errors.startDate?.message}>
                <input type="date" disabled={isPending} className={inputClass} {...register("startDate")} />
              </Field>
              <Field label="End date (optional)" error={errors.endDate?.message}>
                <input type="date" disabled={isPending} className={inputClass} {...register("endDate")} />
              </Field>
            </div>
          </section>
        </form>

        <div className="w-full md:w-80 shrink-0">
          <SlidePreview form={form} />
        </div>
      </div>
    </AdminPage>
  );
}

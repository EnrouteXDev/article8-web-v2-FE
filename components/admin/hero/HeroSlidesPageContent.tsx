"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import AdminPage from "@/components/admin/shared/AdminPage";
import { Spinner } from "@/components/ui/spinner";
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
import { useAllHeroSlides, useDeleteHeroSlide, useUpdateHeroSlide } from "@/lib/queries/hero-slides";
import type { HeroSlide } from "@/lib/types";

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : null;

function scheduleLabel(slide: HeroSlide) {
  const start = formatDate(slide.startDate);
  const end = formatDate(slide.endDate);
  if (!start && !end) return "Always";
  if (start && end) return `${start} – ${end}`;
  if (start) return `From ${start}`;
  return `Until ${end}`;
}

function StatusPill({ slide, now }: { slide: HeroSlide; now: number }) {
  const notStarted = slide.startDate && new Date(slide.startDate).getTime() > now;
  const ended = slide.endDate && new Date(slide.endDate).getTime() < now;

  if (slide.isActive === false) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 text-xs font-medium">
        <span className="size-1.5 rounded-full bg-gray-400 shrink-0" />
        Inactive
      </span>
    );
  }
  if (notStarted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
        <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
        Scheduled
      </span>
    );
  }
  if (ended) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-500 text-xs font-medium">
        <span className="size-1.5 rounded-full bg-red-400 shrink-0" />
        Expired
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-xs font-medium">
      <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
      Live
    </span>
  );
}

export default function HeroSlidesPageContent() {
  const router = useRouter();
  const { data, isLoading, isError } = useAllHeroSlides();
  const { mutate: updateSlide, isPending: isUpdating } = useUpdateHeroSlide();
  const { mutate: deleteSlide, isPending: isDeleting } = useDeleteHeroSlide();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  // Captured once per mount so status pills stay stable across re-renders.
  const [now] = useState(() => Date.now());

  const slides = useMemo(
    () =>
      [...(data?.slides ?? [])].sort((a, b) => {
        const byOrder = (a.order ?? 0) - (b.order ?? 0);
        if (byOrder !== 0) return byOrder;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }),
    [data],
  );

  const liveCount = slides.filter((s) => s.isActive !== false).length;

  const toggleActive = (slide: HeroSlide) => {
    const next = slide.isActive === false;
    updateSlide(
      { id: slide._id, data: { isActive: next } },
      {
        onSuccess: () => toast.success(`"${slide.title}" ${next ? "activated" : "deactivated"}`),
        onError: () => toast.error("Failed to update slide"),
      },
    );
  };

  /** Swap order with the neighbour so slides get distinct, sequential positions. */
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const a = slides[index];
    const b = slides[target];
    // Re-number the whole list so ties (e.g. all zero) resolve cleanly.
    const reordered = [...slides];
    reordered[index] = b;
    reordered[target] = a;
    reordered.forEach((slide, i) => {
      const order = i + 1;
      if (slide.order !== order) {
        updateSlide({ id: slide._id, data: { order } });
      }
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSlide(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`"${deleteTarget.title}" deleted`);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete slide"),
    });
  };

  return (
    <AdminPage className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-base font-semibold text-gray-800">
            {isLoading ? (
              <div className="h-5 w-36 rounded bg-gray-100 animate-pulse" />
            ) : (
              `${slides.length} slides · ${liveCount} active`
            )}
          </span>
          <p className="text-xs text-gray-500 mt-0.5">
            The home page hero cycles through active slides in this order
          </p>
        </div>
        <Link
          href="/admin/hero/create"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors shrink-0"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">New slide</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-6 text-gray-400" />
        </div>
      ) : isError ? (
        <p className="py-16 text-center text-sm text-red-500">Failed to load slides.</p>
      ) : slides.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          No slides yet. Create one to populate the home page hero.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-3 pr-4 text-xs font-medium text-gray-500 w-10">#</th>
                <th className="pb-3 pr-6 text-xs font-medium text-gray-500">Slide</th>
                <th className="pb-3 pr-6 text-xs font-medium text-gray-500">Status</th>
                <th className="pb-3 pr-6 text-xs font-medium text-gray-500">Schedule</th>
                <th className="pb-3 pr-6 text-xs font-medium text-gray-500">Buttons</th>
                <th className="pb-3 pr-6 text-xs font-medium text-gray-500">Updated</th>
                <th className="pb-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {slides.map((slide, index) => (
                <tr
                  key={slide._id}
                  className={`${index !== slides.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}
                >
                  <td className="py-3.5 pr-4 text-sm text-gray-500 font-medium">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3.5 pr-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-10 rounded-md overflow-hidden shrink-0 bg-gray-100">
                        {slide.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={slide.image} alt="" className="w-full h-full object-cover" />
                        )}
                        {slide.backgroundVideo && (
                          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 p-0.5">
                            <Video className="size-3 text-white" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{slide.title}</p>
                        {slide.topSubtitle && (
                          <p className="text-xs text-gray-500 truncate">{slide.topSubtitle}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-6">
                    <StatusPill slide={slide} now={now} />
                  </td>
                  <td className="py-3.5 pr-6 text-sm text-gray-600 whitespace-nowrap">
                    {scheduleLabel(slide)}
                  </td>
                  <td className="py-3.5 pr-6 text-sm text-gray-600">
                    {slide.buttons?.length ? slide.buttons.map((b) => b.text).join(", ") : "—"}
                  </td>
                  <td className="py-3.5 pr-6 text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(slide.updatedAt)}
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
                          <DropdownMenuItem onSelect={() => router.push(`/admin/hero/${slide._id}/edit`)}>
                            <Pencil />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={isUpdating} onSelect={() => toggleActive(slide)}>
                            {slide.isActive === false ? <Eye /> : <EyeOff />}
                            {slide.isActive === false ? "Activate" : "Deactivate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled={index === 0 || isUpdating} onSelect={() => move(index, -1)}>
                            <ArrowUp />
                            Move up
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={index === slides.length - 1 || isUpdating}
                            onSelect={() => move(index, 1)}
                          >
                            <ArrowDown />
                            Move down
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => setDeleteTarget({ id: slide._id, title: slide.title })}
                          >
                            <Trash2 />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete slide?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; will be removed from the home page hero. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting && <Spinner className="size-4" />}
              Delete
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  );
}

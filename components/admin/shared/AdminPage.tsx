import { cn } from "@/lib/utils";

export default function AdminPage({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(className)}
      style={{ fontFamily: "var(--font-satoshi)" }}
    >
      {children}
    </div>
  );
}

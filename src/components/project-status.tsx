import type { ProjectStatus } from "@/content/site";
import { cn } from "@/lib/utils";

export function ProjectStatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status === "Complete" && "bg-accent",
          status === "In progress" && "bg-amber-400",
          status !== "Complete" && status !== "In progress" && "bg-sky-400",
        )}
      />
      {status}
    </span>
  );
}
